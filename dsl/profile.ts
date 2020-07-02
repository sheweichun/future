/**
 * 数据格式定义基础结构[{name: '', children: [], propSchema: [], id: 'xxx'}];
 */
import * as immutable from 'immutable';
import {isDescendant, getProp, ensureIsImmutable} from './util';
import shortid from 'shortid';
const {fromJS} = immutable;
function createChildren(nodeData, removeId) {
  if (removeId) {
    nodeData.id = void 0;
  } else {
    nodeData.id = nodeData.id || (nodeData.name + '_' + shortid.generate());
  }
  nodeData.propSchema = nodeData.propSchema || [];
  nodeData.children = nodeData.children || [];
  nodeData.children = nodeData.children.map((child) => {
    return createChildren(child, removeId);
  });
  return nodeData;
}
function createNodeProfile(nodeData) {
  if (nodeData.__isCursor__) {
    return nodeData.valueOf();
  }
  if (immutable.Iterable.isIterable(nodeData)) {
    return nodeData;
  } else {
    nodeData = typeof nodeData === 'string' ? JSON.parse(nodeData) : nodeData;
    createChildren(nodeData);
    nodeData.children = nodeData.children || [];
    return immutable.fromJS(nodeData);
  }
}
/**
 * 
 * 判断删除的节点是否会影响到目标节点的path, 只有当要删除的元素的父节点为目标元素的祖先节点时, 目标元素的path才会变更. 所以删除后需从最新的引用中取出目标节点的引用
 * profle的所有操作都通过path实现实时从最新的this.store.currentState中读取, 防止上一步的操作产生新对象引用, 而path则很固定
 * @param {*} willRemoveProfile 
 * @param {*} targetProfile 
 */
function getPathAfterRemove(willRemoveProfile, targetProfile) {
  let newPath = willRemoveProfile.pathArray();
  let newProfileIndex = newPath.slice(-1);
  let targetPath = targetProfile.pathArray();
  let newProfileParentChildren = willRemoveProfile.parentChildren();
  //判断要移除的节点的父元素是否为目标节点的祖先节点
  if (isDescendant(newProfileParentChildren, targetProfile)) {
    let targetProfileRelativeParentIndex = targetProfile._keyPath.slice(newProfileParentChildren._keyPath.length, newProfileParentChildren._keyPath.length + 1)
    if (newProfileIndex < targetProfileRelativeParentIndex) {
      let newTargetPath = [...targetProfile._keyPath];
      newTargetPath[newProfileParentChildren._keyPath.length] = Math.max(0, targetProfileRelativeParentIndex - 1);
      return newTargetPath;
    }
  }
  return targetPath
}
const prototypes =  {
  insertAfter(newNode, autoSelect) {
    let parentChildren = this.parentChildren();
    let index = Math.min(parentChildren.size, this.index() + 1);
    let newParentChildren = parentChildren.splice(index, 0, createNodeProfile(newNode));
    let cursor = newParentChildren.get(index);
    autoSelect && cursor.selected();
    return cursor;
  },
  insertBefore(newNode, autoSelect) {
    let parentChildren = this.parentChildren();
    let index = Math.max(0, this.index());
    let newParentChildren = parentChildren.splice(index, 0, createNodeProfile(newNode));
    let cursor = newParentChildren.get(index);
    autoSelect && cursor.selected();
    return cursor;
  },
  appendChild(newNode, autoSelect = true) {
    const newChildren = this._children().push(createNodeProfile(newNode));
    const cursor = newChildren.get(newChildren.size - 1);
    autoSelect && cursor.selected();
    return cursor;
  },
  copy() {
    return this.insertAfter(this.getNoSideEffectJSObject());
  },
  moveDown() {
    const next = this.getNextSibling();
    next && this.moveAfter(next);
  },
  moveUp() {
    const prev = this.getPreviousSibling();
    prev && this.moveBefore(prev);
  },
  moveTo(targetNode) {
    let dslStore = this.store;
    dslStore.silent(() => dslStore.transaction(() => {
      // let nextStore = this.remove().store;
      this.removeNode();
      targetNode = this.store.currentState.getIn(getPathAfterRemove(this, targetNode));
      targetNode.appendChild(this);
      // nextStore.currentState.getIn(targetNode._keyPath).appendChild(profile);
    }));
  },
  moveAfter(targetNode) {
    let dslStore = this.store;
    dslStore.silent(() => dslStore.transaction(() => {
      let profile = this.valueOf();
      this.removeNode();
      targetNode = this.store.currentState.getIn(getPathAfterRemove(this, targetNode));
      targetNode.insertAfter(profile);
    }));
  },
  //在同一组children中移动可能导致顺序混乱
  moveBefore(targetNode) {
    let dslStore = this.store;
    dslStore.silent(() => dslStore.transaction(() => {
      let profile = this.valueOf();
      this.removeNode();
      targetNode = this.store.currentState.getIn(getPathAfterRemove(this, targetNode));
      targetNode.insertBefore(profile);
    }));
  },
  isHovered() {
    const {hovered} = this.store.statelessData;
    return hovered && hovered.id === this.get('id');
  },
  hovered() {
    let prevHovered = this.store.statelessData.hovered || {};
    if (prevHovered.id === this.get('id')) return;
    this.store.setStatelessData({
      hovered: {
        prevPath: prevHovered.path,
        prevId: prevHovered.id,
        path: this._keyPath,
        id: this.get('id')
      }
    })
  },
  beADragTarget(position) {
    let prevDragTarget = this.store.statelessData.dragTarget || {};
    if (prevDragTarget.id === this.get('id') && prevDragTarget.data === position) return;
    this.store.setStatelessData({
      dragTarget: {
        id: this.get('id'),
        path: this._keyPath,
        data: position,
        prevPath: prevDragTarget.path,
        prevId: prevDragTarget.id,
        prevData: prevDragTarget.data
      }
    })
  },
  isDragTarget() {
    const {dragTarget} = this.store.statelessData;
    if(dragTarget && dragTarget.id === this.get('id')) {
      return dragTarget.data
    }
  },
  selected() {
    let prevSelected = this.store.statelessData.selected || {};
    if (prevSelected.id === this.get('id')) return;
    this.store.setStatelessData({
      selected: {
        prevPath: prevSelected.path,
        prevId: prevSelected.id,
        path: this._keyPath,
        id: this.get('id')
      }
    })
  },
  isSelected() {
    const {
      selected
    } = this.store.statelessData;
    return selected && selected.id === this.get('id');
  },
  // selected() {
  //   let dslStore = this.store;
  //   dslStore.silent(() => dslStore.transaction(() => {
  //     let path = dslStore.currentState.get('selected')
  //     if (path) {
  //       let previous = dslStore.currentState.getIn(path);
  //       if (previous) {
  //         dslStore.currentState.getIn(path).set('__update__', Math.random());
  //       }
  //     }
  //     dslStore.currentState.set('selected', this._keyPath);
  //     dslStore.currentState.set('selectedId', this.get('id'));
  //     dslStore.currentState.getIn(this._keyPath).set('__update__', Math.random());
  //   }));
  // },
  replaceNode(newNode) {
    let dslStore = this.store;
    dslStore.silent(() => dslStore.transaction(() => {
      let index = this.index();
      if (index === -1) return;
      this.insertAfter(newNode);
      this.parentChildren().remove(index, this.get('id'));
    }));
  },
  index() {
    let parent = this.parentChildren();
    if (!parent || !parent.indexOf) parent = [];
    return parent.indexOf(this);
  },
  pathArray() {
    return this._keyPath;
  },
  parentChildren() {
    return this.rootState().getIn(this.pathArray().slice(0, -1));
  },
  parentNode() {
    return this.rootState().getIn(this.pathArray().slice(0, -2));
  },
  getNextSibling() {
    let index = this.index();
    let parentChildren = this.parentChildren();
    if (index >= parentChildren.size) {
      return;
    }
    return this.parentChildren().get(index + 1);
  },
  getPreviousSibling() {
    let index = this.index();
    if (index <= 0) {
      return;
    }
    return this.parentChildren().get(index - 1);

  },
  getNestByKey(key) {
    let keys = [];
    key = Array.isArray(key) ? key : [key];
    var parent = this.parentNode();
    while(true) {
      if (!parent || parent.pathArray().length === 0) {
        return keys;
      }
      keys.push(parent.getIn(key));
      parent = parent.parentNode();
    }
  },
  _children() {
    return this.rootState().getIn(this.pathArray().concat(['children']));
    // return this.get('children');
  },
  /**
   * 校验节点是否可删除, slot属性校验应该放置在axml <=> dsl转换中, 临时支持一下
   * 判断移除后如果有两个textNode相连,则合并为一个
   */
  removeNode() {
    if (this.get('deleteAble') === false) return;
    if (this.get('name') === 'slot') return;
    // if (this.parentNode().getTextNodes().length > 1) {
    //   let dslStore = this.store;
    //   let next = this.getNextSibling();
    //   let previous = this.getPreviousSibling();
    //   if (next && previous && next.isTextNode() && previous.isTextNode()) {
    //     dslStore.silent(() => dslStore.transaction(() => {
    //       let index = this._index();
    //       let newCursor = this.parentChildren().remove(index, this.get('id'));
    //       newCursor = newCursor.remove(index, next.get('id'));
    //       let newValue = previous.getPropValue('value') + next.getPropValue('value')
    //       newCursor.setIn([index - 1, 'propSchema', previous.getPropIndex('value'), 'value'], newValue);
    //     }));
    //   }
    // } else {
      return this.parentChildren().remove(this.index(), this.get('id'));
    // }
  },
  rootState() {
    return this.store.currentState;
  },
  isRoot() {
    return this._keyPath.length === 0;
  },
  /**
   *
   //基础结构, createNodeProfile上层保证下属性必选,这里不做过多容错
   * @param {*} key 
   * @param {*} value 
   */
  setProp(key, value, inputType, otherData) {
    let propSchema = this.get('propSchema');
    let propIndex = propSchema.findIndex((v) => v && v.get('name') === key);
    if (propIndex === -1) {
      return this.setIn(['propSchema', propSchema.size], fromJS(Object.assign({name: key, value, type: inputType}, otherData)))
    } else {
      let prevProp = propSchema.get(propIndex).toJS();
      if (inputType) {
        prevProp.inputType = inputType
      }
      return this.setIn(['propSchema', propIndex], fromJS(Object.assign(prevProp, {value}, otherData)));
    }
  },
  getPropValue(key) {
    const prop = this.getProp(key);
    return prop ? prop.get('value') : void 0
  },
  getProp(key) {
    return this.get('propSchema').find(v => v && v.get('name') === key);
  },
  getPropIndex(key) {
    return this.get('propSchema').findIndex(v => v && v.get('name') === key);
  },
  addClassName(classname, propName) {
    propName = propName || 'class';
    let classnames = this.getPropValue(propName) || '';
    let classlist = classnames.split(' ');
    if (classlist.indexOf(classname) === -1) {
      return this.setProp(propName, classlist.concat(classname).join(' '), {
        inputType: 'input',
        valueType: 'String'
      });
    } else {
      return this;
    }
  },
  removeClassName(classname, propName) {
    propName = propName || 'class';
    let classnames = this.getPropValue(propName) || '';
    let classlist = classnames.split(' ');
    let newlist = classlist.filter(v => v !== classname);
    if (newlist.length === classlist.length) {
      return this;
    } else {
      return this.setProp(propName, newlist.join(' '));
    }
  },
  isContainer() {
    return this.get('isContainer')
  },
  isSlot() {
    return this.get('name') === 'slot';
  },
  getNoSideEffectJSObject() {
    return createChildren(this.toJS(), true);
  },
  incognito(handler) {
    this.store.incognito(handler);
  },
  getTextNodes() {
    let textNodes = [];
    this.get('children').forEach(child => {
      if (child.isTextNode()) {
        textNodes.push(child);
      }
    });
    return textNodes;
  },
  isTextNode() {
    return this.get('nodeType') == 3;
  },
  //profile.props.get([0]).set('value', 'xxx', 'data['a'] ? true : false');
  setValueWithExpression(value, expression) {
    return this.setBatched({
      value,
      expression
    })
  },
  appendChildToSlot(slotName, newNode) {
    if (!newNode) return this;
    if (slotName === 'default' || !slotName) {
      return this.appendChild(newNode, true);
    }
    let target = this._children().find(child => child.getPropValue('slot') === slotName);
    if (target) {
      return target.appendChild(newNode, true);
    } else {
      newNode = typeof newNode === 'string' ? JSON.parse(newNode) : newNode;
      newNode.propSchema = newNode.propSchema || {};
      let slotProp = newNode.propSchema.find(prop => prop.name === 'slot');
      if (!slotProp) {
        newNode.propSchema.push({
          name: 'slot',
          value: slotName,
          type: {
            inputType: 'input'
          }
        })
      } else {
        slotProp.value = slotName;
      }
      return this.appendChild(newNode);
      // return this.appendChild({
      //   name: 'slot',
      //   id: `slot_${shortid.generate()}`,
      //   propSchema: [
      //     {
      //       name: 'slot',
      //       value: slotName,
      //       type: {
      //         inputType: 'input'
      //       }
      //     }
      //   ],
      //   children: newNode ? [
      //     typeof newNode === 'string' ? JSON.parse(newNode) : newNode
      //   ] : []
      // }, true);
    }
  }
}
export default prototypes;