import History, {HistoryOptions} from './history';
/// <reference path="myDefintions.d.ts" />
const Cursor = require('./cursor').default;

//全量查找映射关系, 后续根据排序规则按需查找优化.
function restoreAllProfilePath(root: any, map: any) {
  function getChildrenPath(profile: any) {
    map[profile.get('id')] = profile.pathArray();
    (profile.get('children') || []).forEach(getChildrenPath)
  }
  map[root.get('id')] = root.pathArray();
  getChildrenPath(root);
  return map;
}

export interface ITempData {
  prevPath?: any;
  prevId?: any;
  prevData?: any;
  path?: any;//路径无法准确定位到数据, 因为当前存储的路径, 在修改了state后可能对应到了其他数据, 请通过id => path => profile
  id?: any;
  data?: any;
}
export interface IStatelessData {
  hovered?: ITempData
  selected?: ITempData
  dragTarget?: ITempData,
  dragSource?: ITempData
}
export default class Store extends History{
  //全局刷新, 但不记录到历史记录中的数据
  public statelessData: IStatelessData = {};
  transactionStart: boolean = false;
  silentStart: boolean = false;
  incognitoStart: boolean = false;
  incognitoStartState: any
  prevState: any;
  inHistoryChangeLoop: boolean;
  idMap: object;//记录当前状态下id和path的映射关系, cursor创建时记录id=>path, 但cursor是惰性创建的
  findByIdCallback: ({ id: string, callback: (profile: any) => void})[]
  constructor (data: any, opt?: HistoryOptions & {disableHistory?: boolean}) {
    super(data, opt);
    this.idMap = {};
    data.children = data.children || [];
    this.currentState = Cursor.from(data, this.onDataChange, null, this);
    restoreAllProfilePath(this.currentState, this.idMap);
    this.findByIdCallback = [];
  }
  triggerEvent(currentState: any, latestState: any) {
    // setTimeout(() => {
      this.beforeHistoryChange();
      restoreAllProfilePath(currentState, this.idMap);
      super.triggerEvent(currentState, latestState);
      this.afterHistoryChange();
    // })
  }
  beforeHistoryChange = () => {
    this.inHistoryChangeLoop = true;
    this.idMap = {};
  }
  afterHistoryChange = () => {
    this.inHistoryChangeLoop = false;
    this.cursorUpdateComplete();
  }
  onDataChange = (nextValue: any, prevValue: any, keyPath: any) => {
    let currentValue = Cursor.from(nextValue, this.onDataChange, null, this);
    if (!this.incognitoStart && this.incognitoStartState) {//无痕操作后的第一次数据修改, 重新为currentState赋值, 则push历史记录时, 上次的值为无痕操作开始值
      this.currentState = this.incognitoStartState;//
      this.incognitoStartState = void 0;
    }
    if (this.incognitoStart) {
      let latestState = this.currentState;
      this.currentState = currentValue;
      if (!this.silentStart) {
        this.triggerEvent(currentValue, latestState);
      } else {
        restoreAllProfilePath(this.currentState, this.idMap);
      }
      return;
    }
    if (!this.transactionStart) {
      this.push(currentValue);
    } else {
      console.warn('事务操作中');
      let latestState = this.currentState;
      this.currentState = currentValue;
      if (!this.silentStart) {
        this.triggerEvent(currentValue, latestState);
      } else {
        restoreAllProfilePath(this.currentState, this.idMap);
      }
    }
  }
  /**
   * 事务操作中每次操作都触发更新, 但只记录一次历史记录
   * @param handle 
   */
  transaction(handle: () => any) {
    if (this.transactionStart) {
      throw new Error('其他事物操作进行中, 请先结束时再操作');
    }
    this.transactionStart = true;
    if (!this.incognitoStart && this.incognitoStartState) {
      this.prevState = this.incognitoStartState;
      this.incognitoStartState = void 0;
    } else {
      this.prevState = this.currentState;
    }
    const flush = (cancel?: boolean) => {
      try {
        let currentState = this.currentState;
        if (cancel) {
          this.currentState = this.prevState;
          this.triggerEvent(this.currentState, currentState);
        } else {
          this.currentState = this.prevState;//事务开始时的state
          this.push(currentState);
        }
      } catch (e) {
        console.log('事务执行过程失败', e)
      }
      this.transactionStart = false;
    }
    try{
      const res = handle();
      if (res && res['then']) {
        res
        .then(() => flush())
        .catch(() => flush(true))//恢复之前的操作
      } else {
        flush();
      }
    } catch (e) {
      flush(true);
      console.warn('事务执行过程失败', e);
    }
  }
  /**
   * 不触发更新, 结合transaction实现记录一次历史记录且触发一次更新
   * @param handle 
   */
  silent(handle: () => any) {
    this.silentStart = true;
    try{
      handle();
    } finally {
      this.silentStart = false;
    }
  }
  /**
   * 更新数据且触发通知但不保存历史记录
   * 但是在改流程结束后, 再次操作数据, 会将currentState计入历史记录 这次的数据最终数据将记录到历史记录中
   * @param handler 
   */
  incognito(handler: () => void) {
    this.incognitoStart = true;
    this.incognitoStartState = this.currentState;
    try {
      handler();
    } finally {
      this.incognitoStart = false;
      // this.incognitoStartState = void 0;
    }
  }
  forceUpdate() {
    this.triggerEvent(this.currentState, this.currentState);
  }
  setStatelessData(data: IStatelessData) {
    data = data || {};
    Object.keys(data).forEach(key => {
      const currentData = this.statelessData[key];
      if (!data[key]) {
        data[key] = {};
      }
      if (currentData) {
        data[key] = { prevPath: currentData.path, prevId: currentData.id, prevData: currentData.data, ...data[key] };
      }
    });
    this.statelessData = {
      ...this.statelessData,
      ...data
    }
    // this.forceUpdate();
    super.triggerEvent(this.currentState, this.currentState);
  }
  getStatelessData(namespace: string, key?: string) {
    let data = this.statelessData[namespace];
    return key ? (data && data[key]) : data;
  }
  /**
   * 提供的profile不可靠, 获取时, 存储的路径可能已发生变化(如撤销操作等), 在cursor迭代时
   * 建立通过id和path关系, 在onChange结束后, 可拿到最新的id => path的关系
   * @param namespace 
   */
  getStatelessProfile(namespace?: string, callback?: (profile: any) => void) {
    const data = this.getStatelessData(namespace || '') || {};
    if (namespace && !data.id) {
      callback && callback(void 0);
      return;
    }
    let dataId = namespace ? data.id : void 0;
    if (!this.inHistoryChangeLoop) {
      let profile = this.findProfileById(dataId);
      callback && callback(profile);
      return profile;
    } else {
      return this.findProfileById(dataId, callback);
    }
  }
  /**
   * id和path的关系建立实在cursor创建时, cursor是惰性的, 所以这里要保证在state数据都有访问到的情况下调用(render完成)
   * @param id 
   */
  findProfileById(id?: string, callback?: (profile: any) => void) {
    if (!callback) {
      if (id === 'root') return this.currentState;
      if (id) {
        const path = this.idMap[id];
        return path ? this.currentState.getIn(path) : null;
      } else {
        return Object.keys(this.statelessData).reduce((res, key) => {
          let dataPath = this.idMap[(this.getStatelessData(key) || {}).id];
          res[key] = dataPath ? this.currentState.getIn(dataPath) : null;
          return res;
        }, {})
      }
    } else {
      this.findByIdCallback.push({
        id,
        callback
      });
    }
  }
  cursorUpdateComplete() {
    this.findByIdCallback.forEach(task => {
      task.callback(this.findProfileById(task.id));
    });
    this.findByIdCallback = [];
  }
}