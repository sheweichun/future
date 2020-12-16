
import {Store,WrapData, BaseModel,isEqual,createList,createMap} from '../render/index'
import {Commander} from './commander'
import { IViewModel } from "../render/type";
import {COMMANDERS,Utils, modelIsGroup, modelIsRoot, modelIsArtboard,IMutation,IPos} from 'free-canvas-shared';
import {createGroupModel} from '../render/index'
import {getOverlapArtboard} from '../utils/index'
import {CanvasEvent,EventHandler} from '../events/event'
import {Model, updateAllId} from '../render/model';
import {IOperation} from './operation/type';
// import {isEqual} from '../render/dsl/store'
import { OperationPos } from './operation/pos';
import {MutationOptions} from './type';
// import {DRAG_OVER} from '../utils/constant';

// const {encode,encode2ShortId} = Utils
type OnSelected = (data:{x:number,y:number})=>void

type BaseModelAndPos = {
    pos:OperationPos,
    keyPath:string[],
    model:BaseModel
}


function changeVmPos(vm:IViewModel,vmMap:{[key:string]:IViewModel} = {}){
    const parentVm = vm.getParent();
    if(parentVm && modelIsGroup(parentVm.modelType)){
        const pid = parentVm.getModel().get('id',null);
        vmMap[pid] = parentVm;
        return vmMap;
    }
    changeNormalVmPos(vm)
    return vmMap
}

function changeNormalVmPos(vm:IViewModel){
    const relativeRect = vm.getRelativeRect(vm.getRect());
    return vm.getModel().updateIn(['extra','position'],null,(pos:any)=>{
        return WrapData({
            left:relativeRect.left,
            top:relativeRect.top,
            width:pos.get('width'),
            height:pos.get('height')
        })
    })
}


// function changePosByArtboard(diffx:number,diffy:number,vm:IViewModel,data:{left:number,top:number},
//     newParentModel:BaseModel,needRemoveVms:IViewModel[],needAddItems:{[key:string]:{parentModel:BaseModel,target:BaseModel[]}}){
//     const vmModel = vm.getModel();
//     const newVmModel:BaseModel = vmModel.updateIn(['extra','position'],null,(pos:any)=>{
//         return WrapData({
//             left:pos.get('left') + data.left + diffx,
//             top:pos.get('top') + data.top + diffy,
//             width:pos.get('width'),
//             height:pos.get('height')
//         })
//     }).deref(null)
//     needRemoveVms.push(vm);
//     const pid = newParentModel.get('id',null);
//     let addItem = needAddItems[pid]
//     if(addItem == null){
//         addItem = {parentModel:newParentModel,target:[]}
//         needAddItems[pid] = addItem
//     }
//     addItem.target.push(newVmModel);
// }

// function sortBaseModelAndPos(data:BaseModelAndPos[]){
//     return data.sort((a:BaseModelAndPos,b:BaseModelAndPos)=>{
//         const aKeyPath = a.keyPath;
//         const bKeyPath = b.keyPath;
//         const alen = aKeyPath.length;
//         const blen = bKeyPath.length;
//         const compareLen = Math.min(alen,blen);
//         const compareResult = parseInt(aKeyPath[compareLen - 1]) - parseInt(bKeyPath[compareLen - 1]);
//         return compareResult === 0 ? alen - blen : compareResult
//     })
// }
function sortViewModel(data:IViewModel[]){ //保证编组的顺序合理
    return data.sort((a:IViewModel,b:IViewModel)=>{
        const aKeyPath = a.getModel()._keyPath;
        const bKeyPath = b.getModel()._keyPath;
        const alen = aKeyPath.length;
        const blen = bKeyPath.length;
        const compareLen = Math.min(alen,blen);
        const compareResult = parseInt(aKeyPath[compareLen - 1]) - parseInt(bKeyPath[compareLen - 1]);
        return compareResult === 0 ? alen - blen : compareResult
    })
}

// function sortBaseModel(data:BaseModel[]){ //保证编组的顺序合理
//     return data.sort((a:BaseModel,b:BaseModel)=>{
//         const aKeyPath = a._keyPath;
//         const bKeyPath = b._keyPath;
//         const alen = aKeyPath.length;
//         const blen = bKeyPath.length;
//         const compareLen = Math.min(alen,blen);
//         const compareResult = parseInt(aKeyPath[compareLen - 1]) - parseInt(bKeyPath[compareLen - 1]);
//         return compareResult === 0 ? alen - blen : compareResult
//     })
// }

function getBaseModelById(id:string,target:BaseModel):BaseModel{
    if(target == null) return;
    const targetId = target.get('id',null);
    if(targetId === id) return target;
    const children = target.get('children',null);
    if(children == null || children.size === 0){
        return
    }
    for(let i = 0; i < children.size; i++){
        const child = children.get(i);
        const ret = getBaseModelById(id,child);
        if(ret){
            return ret;
        }
    }
}



// function extractAllModel(model:BaseModel,ret:BaseModel[]=[]){
//     const children = model.get('children',null);
//     if(children == null || children.size === 0) return ret;
//     children.forEach((child:BaseModel)=>{
//         ret.push(child.deref(null))
//         extractAllModel(child,ret);
//     })
//     return ret;
// }

// function extractAllModelAndRemoveChild(model:BaseModel,vm:IViewModel,ret:BaseModel[]=[]){
//     const children = model.get('children',null);
//     const vmChildren = vm.children;
//     if(children == null || children.size === 0) return ret;
//     children.forEach((child:BaseModel,index:number)=>{
//         const curVm = vmChildren.viewModelList[index];
//         const curRect = curVm.getRect();
//         extractAllModelAndRemoveChild(child,curVm,ret);
//         let newChild = child.set('children',createList([])) as BaseModel;
//         newChild = newChild.updateIn(['extra','position'],null,()=>createMap({
//             left:curRect.left,
//             top:curRect.top
//         })) as BaseModel
//         ret.push(newChild.deref(null))
//     })
//     return ret;
// }

function extractEachModelAndRemoveChild(model:BaseModel,parentVm:IViewModel,vm:IViewModel,ret:BaseModel[]=[]){
    const children = model.get('children',null);
    const vmChildren = vm.children;
    if(children == null || children.size === 0) return ret;
    children.forEach((child:BaseModel,index:number)=>{
        const curVm = vmChildren.viewModelList[index];
        // curVm.getView().mark();
        const curRect = curVm.getRect();
        // console.log('curRect :',curRect);
        const newChild = child.withMutations((mutChild:BaseModel)=>{
            //@ts-ignore
            const ppPos = parentVm && !modelIsRoot(parentVm.modelType) ? parentVm.getRect() : {left:0,top:0};
            return mutChild.setIn(['extra','position'],createMap({
                left:curRect.left - ppPos.left,
                top:curRect.top - ppPos.top,
                width:curRect.width,
                height:curRect.height
            })).setIn(['extra','isSelect'],true)
        }) as BaseModel
        // const newChild = child.updateIn(['extra','position'],null,()=>createMap({
        //     left:curRect.left,
        //     top:curRect.top
        // })) as BaseModel
        ret.push(newChild.deref(null))
    })
    return ret;
}


export class Mutation extends EventHandler implements IMutation{
    private _onSelectedFn:OnSelected
    private _onSelectStartFn:OnSelected
    private _onSelectMoveFn:OnSelected
    private _onUnselectFn:OnSelected
    private _isDragOver:boolean = false
    private _viewModelMap:Map<string,IViewModel> = new Map()
    private _operation:IOperation
    private _copyTarget:IViewModel[] 
    // private _lastEnter:EventTarget;
    constructor(private _el:HTMLElement,private _store:Store,private _commander:Commander,private _options:MutationOptions){
        super()
        this.listen();
    }
    listen(){
        // this.onDragOver = this.onDragOver.bind(this)
        // this.onDragEnter = this.onDragEnter.bind(this)
        // this.onDragLeave = this.onDragLeave.bind(this)
        // //todo 只能被调用一次
        // const target = document.body.children[0] as HTMLElement
        // this.addEvent(target,CanvasEvent.DRAGOVER,this.onDragOver)
        // this.addEvent(target,CanvasEvent.DRAGENTER,this.onDragEnter)
        // this.addEvent(target,CanvasEvent.DRAGLEAVE,this.onDragLeave)
    }
    destroy(){
        super.destroy();
        this._commander.clear();
    }
    addViewModel(viewModel:IViewModel){
        // this._viewModelMap.set(encode(viewModel.getModel()._keyPath),viewModel);
        this._viewModelMap.set(viewModel.getModel().get('id',null),viewModel);
    }
    getArtboards(excludeIds?:{[key:string]:boolean}){
        const artboards:IViewModel[] = []
        this._viewModelMap.forEach((value,key)=>{
            if(excludeIds && excludeIds[key]) return;
            if(modelIsArtboard(value.modelType)){
                artboards.push(value)
            }
        })
        return sortViewModel(artboards);
    }
    changeDisplayName(id:string,displayName:string){
        // const selectModels = this.getSelectedBaseModels() as BaseModel[]
        const target:BaseModel = getBaseModelById(id,this.getDSLData());
        if(target){
            target.updateIn(['displayName'],null,()=>{
                return displayName
            })
        }
    }
    removeViewModel(viewModel:IViewModel){
        const vmId = viewModel.getModel().get('id',null)
        const oldVm = this._viewModelMap.get(vmId);
        if(oldVm == viewModel){
            this._viewModelMap.delete(vmId);
        }
    }
    getViewModel(id:string){
        return this._viewModelMap.get(id);
    }
    getAllArtboardVms(){
        // const data = this.getDSLData();
        // const childs = data.get('children',[]);
        // const artboards:IViewModel[] = []
        // childs.forEach((child:BaseModel)=>{
        //     const vm = this._viewModelMap.get(child.get('id',null));
        //     if(vm == null) return;
        //     if(modelIsArtboard(vm.modelType)){
        //         artboards.push(vm);
        //     }
        // })
        // return artboards;
        return this.getArtboards()
    }
    getViewModelBaseModel(id:string){
        return this._viewModelMap.get(id).getModel();
    }
    removeViewModelById(id:string){
        this._viewModelMap.delete(id)
    }
    setOperation(operation:IOperation){
        this._operation = operation;
    }
    getSelectedBaseModels(pure:boolean = false){
        const arr:BaseModel[]|Model[] = [];
        this.reduceSelectedKeyPath((keyPath:string)=>{
            const item = this._viewModelMap.get(keyPath);
            if(item){
                const itemModel = item.getModel();
                arr.push(pure ? itemModel.searialize() : itemModel)
            }
        })
        return arr;
    }
    getSelectedValidViewModels(){  
        const arr:IViewModel[] = [];
        this.reduceSelectedKeyPath((keyPath:string)=>{
            const item = this._viewModelMap.get(keyPath);
            //移除画板
            if(item && !modelIsArtboard(item.modelType)){
                arr.push(item)
            }
        })
        return sortViewModel(arr);
    }
    getAllSelectedViewModels(){
        const arr:IViewModel[] = [];
        this.reduceSelectedKeyPath((keyPath:string)=>{
            const item = this._viewModelMap.get(keyPath);
            if(item){
                arr.push(item)
            }
        })
        return sortViewModel(arr);
    }
    // getAllSelectedBaseModels(){
    //     const arr:BaseModel[] = [];
    //     this.reduceSelectedKeyPath((keyPath:string)=>{
    //         const item = this._viewModelMap.get(keyPath);
    //         if(item){
    //             arr.push(item.getModel())
    //         }
    //     })
    //     return arr;
    // }
    register(){
        this._commander.register(COMMANDERS.POSITIONCHANGE,this.onPostionChanges,this);
        this._commander.register(COMMANDERS.SELECTED,this.onSelected,this);
        this._commander.register(COMMANDERS.UNSELECTED,this.onUnSelected,this);
        this._commander.register(COMMANDERS.ADD,this.addModel,this);
        this._commander.register(COMMANDERS.SELECTENTER,this.onDragEnter,this);
        this._commander.register(COMMANDERS.SELECTLEAVE,this.onDragLeave,this);
    }
    onDragLeave(e:DragEvent){
        this._isDragOver = false;
        // if(this._lastEnter === e.target){
        //     this._isDragOver = false;
        //     document.body.classList.remove(DRAG_OVER);
        //     e.stopPropagation();
        //     e.preventDefault();
        // }
    }
    onDragEnter(e:DragEvent){
        this._isDragOver = true;
        // this._lastEnter = e.target;
        // document.body.classList.add(DRAG_OVER)
    }
    copy(){
        this._copyTarget = this.getAllSelectedViewModels();
    }
    paste(){
        if(this._copyTarget == null) return;
        // const addKeyPaths:string[][] = []
        this.transition(()=>{
            this._onUnSelected();
            const dslData = this.getDSLData();
            // const originPath = dslData._keyPath;
            let selectIds:string[] = [];
            dslData.update('children',(old:BaseModel)=>{
                // const oldSize = old.size;
                //@ts-ignore
                return old.push(...this._copyTarget.map((vm:IViewModel,index:number)=>{
                    const item = vm.getModel();
                    const itemRect = vm.getRect();
                    const searilizeData = item.searialize();
                    const cloneData = updateAllId(searilizeData);
                    cloneData.pid = searilizeData.id;
                    const {position} = cloneData.extra;
                    cloneData.extra.position = Object.assign({},position,{
                        left : itemRect.left + 20,
                        top: itemRect.top + 20
                    })
                    cloneData.extra.isSelect = true;
                    // newId = cloneData.id;
                    // addKeyPaths.push([].concat(originPath,['children',oldSize + index]));
                    // console.log('id :',cloneData.id);
                    selectIds.push(cloneData.id);
                    return WrapData(cloneData);
                }));
            })
            this.addKeyPath(...selectIds)
            // this.addKeyPath(newId);
        })
        // console.log('addKeyPaths :',addKeyPaths);
        
    }
    // onDragOver(e:DragEvent){
    //     this._isDragOver = true;
    //     e.preventDefault();
    // }
    registerSelectCallbacks(onSelect:OnSelected,onSelectStartFn:OnSelected,onSelectMove:OnSelected,onUnselect:OnSelected){
        this._onSelectedFn = onSelect;
        this._onSelectMoveFn = onSelectMove
        this._onSelectStartFn = onSelectStartFn
        this._onUnselectFn = onUnselect
        this._commander.register(COMMANDERS.SELECTSTART,this._wrapOnSelectStartFn,this); //拖拽行为
        this._commander.register(COMMANDERS.SELECTMOVE,this._wrapOnSelectMoveFn,this);
        this._commander.register(COMMANDERS.SELECTSTOP,this._wrapOnUnselectFn,this);
    }
    _fixSelectData(data:{x:number,y:number}){
        if(data == null) return data;
        const {x,y} = data;
        const {left,top} = this._options.getRect()
        return {
            x:x - left,
            y:y - top
        }
    }
    _wrapOnSelectMoveFn(data:{x:number,y:number}){
        this._onSelectMoveFn(this._fixSelectData(data));
    }
    _wrapOnSelectStartFn(data:{x:number,y:number}){
        this._isDragOver = false;
        this._onSelectStartFn(this._fixSelectData(data));
    }
    _wrapOnUnselectFn(data:{x:number,y:number}){ //data无意义
        if(!this._isDragOver){
            this.removeSelectModels();
            this._operation.hideMakers();
        }else{
            this._onUnselectFn(this._fixSelectData(data));
        }
        this._operation.disableMove();
        this._isDragOver = false;
    }
    removeSelectModels(){
        this.removeModels(this.getSelectedValidViewModels())
    }
    // removeSelectedKeyPath(keyPath:any[]){

    // }
    // getSelected(){
    //     const selectedKeyPaths = this.getSelectedKeyPaths();
    //     const currentState = this._store.currentState;
    //     const ret:BaseModel[] = [];
    //     selectedKeyPaths.forEach((keyPath:string)=>{
    //         const item = currentState.getIn(decode(keyPath));
    //         ret.push(item)
    //     })
    //     return ret;
    // }
    
    reduceSelectedKeyPath(fn:(keyPath:string)=>void){
        const selectedKeyPaths = this.getSelectedKeyPaths();
        selectedKeyPaths.forEach((keyPath:string)=>{
            fn(keyPath)
        })
    }
    // getStoreCurrentState(){
    //     return this._store.currentState
    // }
    getDSLData(){
        return this._store.currentState.get('data')
    }
    getSelectedKeyPaths(){
        return this._store.currentState.get('selectedKeyPaths');
    }
    notRecord(fn:(store:Store)=>void){
        this._store.notRecordInHistory(()=>{
            fn(this._store)
        })
    }
    transition(fn:(store:Store)=>void){
        this._store.transition(()=>{
            fn(this._store)
        })
    }
    each(curModel:BaseModel,fn:(item:BaseModel)=>boolean){
        const ret = fn(curModel);
        // console.log('in each before child :',Date.now() - now);
        if(!ret) return;
        const children = curModel.get('children',null);
        if(children){
            for(let i = 0 ; i < children.size; i++){
                this.each(children.get(i),fn)
            }
        }
        // console.log('in each :',Date.now() - now);
    }
    eachModelAndVm(curModel:BaseModel,vm:IViewModel,fn:(item:BaseModel,vm:IViewModel)=>boolean){ //深度优先遍历
        const ret = fn(curModel,vm);
        // console.log('in each before child :',Date.now() - now);
        if(!ret) return;
        const children = curModel.get('children',null);
        const childrenVms = vm.children;
        if(children && childrenVms){
            for(let i = 0 ; i < children.size; i++){
                this.eachModelAndVm(children.get(i),childrenVms.viewModelList[i],fn)
            }
        }
        // console.log('in each :',Date.now() - now);
    }
    // addKeyPath(keyPath:any[]){
    //     this.getSelectedKeyPaths().push(encode(keyPath));
    // }
    addKeyPath(...keyPaths:string[]){
        // this.getSelectedKeyPaths().push(...(keyPaths.map((item)=>{
        //     return encode(item)
        // })));
        this.getSelectedKeyPaths().push(...keyPaths);
    }
    keyPathsIsNotEmpty(){
        return this.getSelectedKeyPaths().size > 0
    }
    clearKeyPath(){
        this._store.currentState.updateIn(['selectedKeyPaths'],()=>createList([]))
    }
    removeKeyPath(keyPathStr:string){
        const selectedKeyPaths = this.getSelectedKeyPaths();
        const targetIndex = selectedKeyPaths.findIndex((value:any,index:number)=>{
            return value === keyPathStr
        })
        if(targetIndex >= 0){
            selectedKeyPaths.delete(targetIndex);
        }
        return selectedKeyPaths;
    }
    _removeModelsFromEachModel(vms:IViewModel[],target:BaseModel):BaseModel{
        if(vms.length === 0 || target == null) return target;
        let curModel = target
        const {_store} = this;
        // const realModel = this._store.getRealFromPath(curModel._keyPath,null)
        // if(realModel == null) return curModel;
        // const children = realModel.get('children',null);

        const children = curModel.get('children',null);
        if(children == null || children.size === 0) return curModel; 
        let newChilds:any[] = [];
        // console.log('before child size :',children.size);
        for(let j = 0; j < children.size; j++){
            let child = children.get(j);
            let isShoted = false,i;
            for(i = 0; i < vms.length; i++){
                const vm = vms[i];
                if(child.get('id',null) === vm.getModel().get('id',null)){
                // if(isEqual(child,vm.getModel())){
                    isShoted = true;
                    break;
                }
            }
            if(!isShoted){
                newChilds.push(child);
            }else{
                vms.splice(i,1);
            }
        }
        newChilds = newChilds.reduce((ret,ch)=>{
            // return ret.push(this._removeModelsFromEachModel(vms,ch).deref(null));
            this._removeModelsFromEachModel(vms,ch);
            return ret.push(_store.getRealRerefFromPath(ch._keyPath));
        },createList([]))
        const ret = curModel.updateIn(['children'],null,()=>{
            return newChilds
        })
        return ret as BaseModel;
    }

    unGroup(vms:IViewModel[]){ //解除编组
        if(vms == null || vms.length === 0) return 
        // console.log('dslData :',this.getDSLData().toJS());
        this.transition(()=>{
            const selectedKeys:string[] = [];
            vms.forEach((vm)=>{
                const curChild = vm.getModel().get('children',null);
                if(curChild == null || curChild.size === 0) return;
                const parentVm = vm.getParent();
                const parentModel = parentVm.getModel();
                const curModel = vm.getModel();
                const models = extractEachModelAndRemoveChild(curModel,parentVm,vm); //提取子节点，并重新计算定位
                let newChilds:BaseModel[] = null;
                const isGroup = modelIsGroup(curModel.get('type',false));
                if(isGroup){
                    const parentChild = parentModel.get('children',null);
                    newChilds = []
                    parentChild.forEach((child:any)=>{
                        if(!isEqual(child,curModel)){
                            newChilds.push(child.deref(null));
                        }
                    })
                }
                curModel.set('children',createList([])) //清除子节点
                const newParentModel = (parentModel.updateIn(['children'],null,(oldChilds:BaseModel[])=>{
                    if(isGroup) return createList(newChilds).push(...models);
                    return oldChilds.push(...models); //添加子节点为兄弟节点
                }) as BaseModel)
                const newParentModelChildren = newParentModel.get('children',null);
                newParentModelChildren.forEach((item:BaseModel)=>{
                    if(item.getIn(['extra','isSelect'],false)){
                        // selectedKeys.push(encode(item._keyPath))
                        selectedKeys.push(item.get('id',null))
                    }
                })
            })
            const state = this._store.currentState
            state.updateIn(['selectedKeyPaths'],null,()=>{ //更新选中项
                return createList(selectedKeys)
            })
        })
        
    }
    removeModel(parentModel:BaseModel ,model:BaseModel){
        parentModel.updateIn(['children'],null,(parentModelChild:any)=>{
            const newChilds:BaseModel[] = []
            for(let i = 0; i < parentModelChild.size; i++){
                const curParentChild = parentModelChild.get(i);
                // if(!isEqual(curParentChild,model)){
                if(curParentChild.get('id',null) !== model.get('id',null)){
                    newChilds.push(curParentChild);
                }
            }
            const ret = createList(newChilds);
            return ret;
        })
    }
    /** 
     * 
     *  如果是同层级就在同层级创建一个group包裹起来
     *  不是同层级就在更深层级的地方创建一个group包裹起来
     * 
     **/
    group(vms:IViewModel[],pos:OperationPos){ //编组
        if(vms == null || vms.length <= 1) return 
        let depth = 0,deepKeyPath:string[],deepVm:IViewModel;
        const hasArtboard = vms.filter((vm)=>{
            return modelIsArtboard(vm.modelType)
        }).length > 0
        if(hasArtboard) return;
       this.transition(()=>{
        const childs:BaseModelAndPos[] = []
        vms.forEach((vm,index)=>{
            const parentVm = vm.getParent();
            if(parentVm == null) return;
            const parentModel = parentVm.getModel()
            const parentKeyPath = parentModel._keyPath
            const parentKeyPathLen = parentKeyPath.length
            if(parentKeyPathLen > depth){
                depth = parentKeyPathLen;
                deepKeyPath = parentKeyPath
                deepVm = parentVm
            }
            const model = vm.getModel();
            // console.log('keyPath :',model._keyPath);
            childs.push({
                pos:vm.getRect(),
                keyPath:model._keyPath,
                model:model.deref(null)
            })
            this.removeModel(parentModel,model);
        })
        // sortBaseModelAndPos(childs); //保证编组的顺序合理
        const targetParent = this._store.getRealFromPath(deepKeyPath,null);
        if(targetParent == null) return;

        const parentRect = modelIsRoot(deepVm.modelType) ? {left:0,top:0} : deepVm.getRect();
        const groupModel = createGroupModel(pos.left - parentRect.left,pos.top - parentRect.top,pos.width,pos.height);
        targetParent.updateIn(['children'],(old:any)=>{
            // targetIndex = old.size;
            const ret = old.push(WrapData(groupModel).withMutations((mutModel:BaseModel)=>{
                return mutModel.set('children',createList(childs.map((ch:BaseModelAndPos)=>{
                    const {model,pos:modelPos} = ch;
                    // return model.updateIn(['extra','position'],null,(oldPosition:BaseModel)=>{
                    //     return createMap({
                    //         left:modelPos.left - pos.left,
                    //         top:modelPos.top - pos.top,
                    //         width:modelPos.width,
                    //         height:modelPos.height
                    //     })
                    // })
                    return model.updateIn(['extra'],null,(extra:BaseModel)=>{
                        //@ts-ignore
                        return extra.merge(WrapData({
                            position:{
                                left:modelPos.left - pos.left,
                                top:modelPos.top - pos.top,
                                width:modelPos.width,
                                height:modelPos.height
                            },
                            isSelect:false
                        }))
                    })
                })))
            }))
            return ret;
        });
        const state = this._store.currentState
        state.updateIn(['selectedKeyPaths'],null,()=>{ //更新选中项
            return createList([groupModel.id])
        })
        // console.log('data :',state._deref().toJS());
       })
    }
    removeModels(vms:IViewModel[]){
        const dslData = this.getDSLData();
        this.transition(()=>{
            this._onUnSelected();
            this._removeModelsFromEachModel([].concat(vms),dslData);
        })
    }
    // removeSelectedModels(){
    //     this.removeModels(this.getSelectedValidViewModels());
    // }
    addModel(data:Model){
        if(data == null) return;
        let target:BaseModel;
        data.extra.isSelect = true;
        data = updateAllId(data);
        this.transition(()=>{
            this._onUnSelected();
            const dslData = this.getDSLData();
            dslData.update('children',(old:BaseModel)=>{
                //@ts-ignore
                return old.push(WrapData(data));
            })
        })
        const newDslData = this.getDSLData();
        const newChilds = newDslData.get('children')
        target = newChilds.get(newChilds.size - 1);
        this.addKeyPath(target.get('id',null));
        // return encode2ShortId(target._keyPath)
    }
    updateGroupVm(needChangePosVMMap:{[key:string]:IViewModel},noChild:boolean=false){
        Object.keys(needChangePosVMMap).forEach((pid:string)=>{
            const parent = needChangePosVMMap[pid];
            const parentChild = parent.children
            // if(parentChild == null) return;
            // const poses = parentChild.viewModelList.map((child)=>{
            //     return child.getRect();
            // })
            // const newPos = calculateIncludeRect(poses);
            // const updatePos = parent.getRelativeRect(newPos);
            
            noChild && parentChild.viewModelList.forEach((vm:IViewModel)=>{
                this._changeVmPosAndSize(vm,noChild);
            })
            this._changeVmPosAndSize(parent,noChild);
        })
    }
    // onPostionChanges(val:{vms:IViewModel[],data:{left:number,top:number}}){
    //     const {vms,data:posData} = val
    //     const artboards = this.getAllArtboardVms();
    //     const dslData = this.getDSLData();
    //     const _this = this;
    //     const needRemoveVms:IViewModel[] = [];
    //     const needAddItems:{[key:string]:{parentModel:BaseModel,target:BaseModel[]}} = {}
    //     const needChangePosVMMap:{[key:string]:IViewModel} = {}


    //     function changeVmPos(vm:IViewModel,data:{left:number,top:number}){
    //         const parentVm = vm.getParent();
    //         if(parentVm && modelIsGroup(parentVm.modelType)){
    //         // if(parentVm && (!modelIsRoot(parentVm.modelType) && !modelIsArtboard(parentVm.modelType))){
    //             const pid = parentVm.getModel().get('id',null);
    //             needChangePosVMMap[pid] = parentVm;
    //             return;
    //         }
    //         vm.getModel().updateIn(['extra','position'],null,(pos:any)=>{
    //             return WrapData({
    //                 left:pos.get('left') + data.left,
    //                 top:pos.get('top') + data.top,
    //                 width:pos.get('width'),
    //                 height:pos.get('height')
    //             })
    //         })
    //     }


    //     function changePosByArtboard(diffx:number,diffy:number,vm:IViewModel,data:{left:number,top:number},newParentModel:BaseModel){
    //         const vmModel = vm.getModel();
    //         const newVmModel:BaseModel = vmModel.updateIn(['extra','position'],null,(pos:any)=>{
    //             return WrapData({
    //                 left:pos.get('left') + data.left + diffx,
    //                 top:pos.get('top') + data.top + diffy,
    //                 width:pos.get('width'),
    //                 height:pos.get('height')
    //             })
    //         }).deref(null)
    //         needRemoveVms.push(vm);
    //         const pid = newParentModel.get('id',null);
    //         let addItem = needAddItems[pid]
    //         if(addItem == null){
    //             addItem = {parentModel:newParentModel,target:[]}
    //             needAddItems[pid] = addItem
    //         }
    //         addItem.target.push(newVmModel);
    //     }

    //     function vmOutArtboard(overlapArtboard:IViewModel,vm:IViewModel,data:{left:number,top:number}){
    //         const artboardRect = overlapArtboard.getRect();
    //         changePosByArtboard(artboardRect.left,artboardRect.top,vm,data,dslData)
    //     }

    //     function vmFromToArtboard(fromArtboard:IViewModel,toArtboard:IViewModel,vm:IViewModel,data:{left:number,top:number}){
    //         const fromArtboardRect = fromArtboard.getRect();
    //         const toArtboardRect = toArtboard.getRect();
    //         changePosByArtboard(
    //             fromArtboardRect.left - toArtboardRect.left,
    //             fromArtboardRect.top - toArtboardRect.top,
    //             vm,data,toArtboard.getModel())
    //     }


    //     function vmIntoArtboard(overlapArtboard:IViewModel,vm:IViewModel,data:{left:number,top:number}){
    //         const artboardRect = overlapArtboard.getRect();
    //         const overlapArtboardModel = overlapArtboard.getModel();
    //         changePosByArtboard(- artboardRect.left,- artboardRect.top,vm,data,overlapArtboardModel)
    //     }

    //     this.transition(()=>{
    //         vms.forEach((vm)=>{
    //             const vmIsArtboard = modelIsArtboard(vm.modelType);
    //             if(vmIsArtboard) return changeVmPos(vm,posData);
    //             const parentVm = vm.getInitialParent();
    //             const parentVmIsArtboard = modelIsArtboard(parentVm.modelType);
    //             const parentVmIsRoot = modelIsRoot(parentVm.modelType);
    //             const overlapArtboard = getOverlapArtboard(artboards,vm.getRect()); //todo 待完善 因为重叠的画板可能有多个 通过什么策略选择最合适的画板
    //             if(parentVmIsRoot){ //根下节点
    //                 if(overlapArtboard){ //根下节点跟画板重合
    //                     vmIntoArtboard(overlapArtboard,vm,posData);
                        
    //                 }else{
    //                     changeVmPos(vm,posData);
    //                 }
    //             }else{ //非根下节点
    //                 if(parentVmIsArtboard){ //非根下节点父节点是画板
    //                     if(overlapArtboard){ //非根下节点跟一个画板重合
    //                         if(overlapArtboard !== parentVm){ //非根节点从原来的画板移动到新的画板
    //                             vmFromToArtboard(parentVm,overlapArtboard,vm,posData);
    //                         }else{ //非根节点还在原来画板中
    //                             changeVmPos(vm,posData);
    //                         }
    //                     }else{ //todo 这里应该从画板中移除掉
    //                         vmOutArtboard(parentVm,vm,posData);
    //                     }
    //                 }else{ //非根节点父节点不是画板
    //                     changeVmPos(vm,posData);
    //                 }
    //             }
    //         })
    //         this.updateGroupVm(needChangePosVMMap,true)

    //         this._removeModelsFromEachModel(needRemoveVms,dslData); //先删除待删除的节点
    //         Object.keys(needAddItems).forEach((pid:string)=>{
    //             const {parentModel,target} = needAddItems[pid]
    //             parentModel.updateIn(['children'],null,(childs:BaseModel)=>{
    //                 //@ts-ignore
    //                 return childs.push(...target);
    //             })
    //         })
    //     })
    // }
    onPostionChanges(val:{vms:IViewModel[],data:{left:number,top:number}}){
        const {vms,data:posData} = val
        const dslData = this.getDSLData();
        const needChangePosVMMap:{[key:string]:IViewModel} = {}
        const needRemoveVms:IViewModel[] = [];
        const needAddItems:{[key:string]:{parentModel:BaseModel,target:BaseModel[]}} = {}
        this.transition(()=>{
            vms.forEach((vm)=>{
                const {modelType} = vm;
                const pvm = vm.getParent();
                const prevPvm = vm.getPrevParent();
                vm.resetPrevParent();  //清楚prevParent
                if(modelIsGroup(pvm.modelType) || modelIsArtboard(modelType)){
                    changeVmPos(vm,needChangePosVMMap);
                }else{
                    if(pvm !== prevPvm){
                        needRemoveVms.push(vm);
                        const parentModel = pvm.getModel();
                        const pid = parentModel.get('id',null);
                        let addItem = needAddItems[pid]
                        if(addItem == null){
                            addItem = {parentModel:parentModel,target:[]}
                            needAddItems[pid] = addItem
                        }
                        const newVmModel = changeNormalVmPos(vm).deref(null);
                        addItem.target.push(newVmModel);
                    }else{
                        // changeVmPos(vm,needChangePosVMMap);
                        changeNormalVmPos(vm);
                    }
                }
            })
            this.updateGroupVm(needChangePosVMMap,true)

            this._removeModelsFromEachModel(needRemoveVms,dslData); //先删除待删除的节点
            Object.keys(needAddItems).forEach((pid:string)=>{
                const {parentModel,target} = needAddItems[pid]
                parentModel.updateIn(['children'],null,(childs:BaseModel)=>{
                    if(childs){
                         //@ts-ignore
                        return childs.push(...target);
                    }else{
                        return createList(target)
                    }
                })
            })
        })
    }
    _changeVmPosAndSize(vm:IViewModel,noChild:boolean = false){
        const oldVm = vm.getModel();
        oldVm.updateIn(['extra','position'],null,(pos:any)=>{
            return WrapData(vm.getRelativeRect(vm.getRect()))
        })

        if(vm.children.size && !noChild){
            vm.children.viewModelList.forEach((child)=>{

                this._changeVmPosAndSize(child)
            })
        }
    }
    // changePosAndSize(vms:IViewModel[],data:{left:number,top:number,width:number,height:number}){
    changePosAndSize(vms:IViewModel[]){
        // const artboards = this.getAllArtboardVms();
        this.transition(()=>{
            const needChangePosVMMap:{[key:string]:IViewModel} = {}
            vms.forEach((vm)=>{
                // const pos = vm.getRelativeRect(vm.getRect());
                
                const parentVm = vm.getParent();
                parentVm.mark(false);
                if(modelIsGroup(parentVm.modelType)){
                // if(parentVm && (!modelIsRoot(parentVm.modelType) && !modelIsArtboard(parentVm.modelType))){
                    const pid = parentVm.getModel().get('id',null);
                    needChangePosVMMap[pid] = parentVm;
                    return;
                }
                this._changeVmPosAndSize(vm);
            })
            this.updateGroupVm(needChangePosVMMap,false);
        })
    }
    _onUnSelected(){ //取消组件选中
        if(!this.keyPathsIsNotEmpty()) return;
        this.each(this.getDSLData(),(curModel:BaseModel)=>{
            if(curModel.getIn(['extra','isSelect'],false)){
                curModel.updateIn(['extra','isSelect'],null,()=>false)
                // return false;
            }
            return true;
        })
        this.clearKeyPath();
    }
    onUnSelected(){ //取消组件选中
        this.notRecord((store)=>{
            this._onUnSelected();
        })
    }
    // registerOnSelect(fn:OnSelected){
    //     this._onSelected = fn;
    // }
    _clearVmsSelect(data:BaseModel){
        const children = data.get('children',null);
        if(children){
            for(let i = 0 ; i < children.size; i++){
                const childModel = children.get(i);
                const curSelect = childModel.getIn(['extra','isSelect'],false);
                if(curSelect){
                    this.removeKeyPath(childModel.get('id',null));
                    childModel.updateIn(['extra','isSelect'],null,()=> false);
                }
                this._clearVmsSelect(childModel)
            }
        }
    }
    updateSelectVmsByPos(data:BaseModel,target:IViewModel,pos:OperationPos){  //选择框框选选中组件
        this.notRecord(()=>{
            this.eachModelAndVm(data,target,(curModel:BaseModel,vm:IViewModel)=>{ //深度优先遍历，当前节点跟选择框重叠时，不用再想子节点去检索
                // const isRoot = modelIsRoot(vm.modelType);
                if(modelIsRoot(vm.modelType) || modelIsArtboard(vm.modelType)) return true;
                const vmPos = vm.getAbsRect();
                const shouldSelect = vmPos.isOverlap(pos);
                const curSelect = curModel.getIn(['extra','isSelect'],false);
                if(curSelect !== shouldSelect){
                    if(shouldSelect){
                        this.addKeyPath(curModel.get('id',null));
                        this._clearVmsSelect(curModel);
                    }else{
                        this.removeKeyPath(curModel.get('id',null));
                    }
                    curModel.updateIn(['extra','isSelect'],null,()=> shouldSelect);
                }
                return !shouldSelect;
            })
        })
    }
    _onModelSelected(target:BaseModel,data:{needKeep:boolean,x:number,y:number,noTrigger?:boolean}){ //选中组件
        const {needKeep} = data;
        this.each(this.getDSLData(),(curModel:BaseModel)=>{
            const isSelected = curModel.getIn(['extra','isSelect'],false)
            const curId = curModel.get('id',null),targetId = target.get('id',null)
            // console.log('isSelected :',isSelected);
            //todo 如果数据都一致的话会存在重复的问题
            // if(isEqual(curModel,target) && (encode(curModel._keyPath) === encode(target._keyPath))){
            if(curId === targetId){
                if(isSelected && needKeep && this.keyPathsIsNotEmpty()){
                    this.removeKeyPath(curId);
                    curModel.updateIn(['extra','isSelect'],null,()=>false)
                }else if(!isSelected){
                    this.addKeyPath(curId);
                    curModel.updateIn(['extra','isSelect'],null,()=>true)
                }
            }else if(!needKeep && isSelected){
                this.removeKeyPath(curId);
                curModel.updateIn(['extra','isSelect'],null,()=>false)
            }
            return true;
        })
    }
    onModelSelected(target:BaseModel,data:{needKeep:boolean,x:number,y:number,noTrigger?:boolean}){ //选中组件
        //@ts-ignore
        const {noTrigger,x,y} = data;
        this.notRecord((store)=>{
            // const target = vm.getModel();
            this._onModelSelected(target,data);
        });
        (!noTrigger && this._onSelectedFn) && this._onSelectedFn({x,y});
    }
    onSelected(val:{vm:IViewModel,data:{needKeep:boolean,x:number,y:number,noTrigger?:boolean}}){
        const {vm,data} = val;
        return this.onModelSelected(vm.getModel(),data);
    }
    getTreeStuctrueSelectedViewModels(){
        const selectVms = this.getAllSelectedViewModels();
        const vmMap:{[key:string]:{
            parent:IViewModel,
            childrenMap:{
                [key:string]:boolean
            }
        }} = {}
        selectVms.forEach((selectedVm)=>{
            const selectedModel = selectedVm.getModel();
            const parent = selectedVm.getParent();
            if(parent == null) return;
            const parentModel = parent.getModel();
            const parentId = parentModel.get('id',null);
            let target = vmMap[parentId];
            if(target == null){
                target = {parent,childrenMap:{}}
                vmMap[parentId] = target;
            }
            target.childrenMap[selectedModel.get('id',null)] = true
        })
        return vmMap
    }
    //model 层级操作
    moveUpest(){
        this.transition(()=>{
            const vmMap = this.getTreeStuctrueSelectedViewModels();
            Object.keys(vmMap).forEach((id)=>{
                const {parent,childrenMap} = vmMap[id]
                const newModelList:BaseModel[] = []
                const parentModel = parent.getModel();
                const appendMds:BaseModel[] = []
                parent.children.viewModelList.forEach((vm)=>{
                    const vmModel = vm.getModel();
                    const vmId = vmModel.get('id',null);
                    const derefModel = vmModel.deref(null)
                    if(childrenMap[vmId] == null){
                        newModelList.push(derefModel)
                    }else{
                        appendMds.push(derefModel)
                    }
                })
                parentModel.updateIn(['children'],null,()=>{
                    return createList([].concat(newModelList,appendMds));
                })
            })
        })
    }
    moveDownest(){
        this.transition(()=>{
            const vmMap = this.getTreeStuctrueSelectedViewModels();
            Object.keys(vmMap).forEach((id)=>{
                const {parent,childrenMap} = vmMap[id]
                const newModelList:BaseModel[] = []
                const parentModel = parent.getModel();
                const appendMds:BaseModel[] = []
                parent.children.viewModelList.forEach((vm)=>{
                    const vmModel = vm.getModel();
                    const vmId = vmModel.get('id',null);
                    const derefModel = vmModel.deref(null);
                    if(childrenMap[vmId] == null){
                        newModelList.push(derefModel)
                    }else{
                        appendMds.push(derefModel)
                    }
                })
                parentModel.updateIn(['children'],null,()=>{
                    return createList([].concat(appendMds,newModelList));
                })
            })
        })
    }
    moveDownOneStep(){
        this.transition(()=>{
            const vmMap = this.getTreeStuctrueSelectedViewModels();
            Object.keys(vmMap).forEach((id)=>{
                const {parent,childrenMap} = vmMap[id]
                const newModelList:BaseModel[] = []
                const parentModel = parent.getModel();
                parent.children.viewModelList.forEach((vm)=>{
                    const vmModel = vm.getModel();
                    const vmId = vmModel.get('id',null);
                    const derefModel = vmModel.deref(null)
                    if(childrenMap[vmId] == null){
                        newModelList.push(derefModel)
                    }else{
                        newModelList.splice(newModelList.length - 1,0,derefModel);
                    }
                })
                parentModel.updateIn(['children'],null,()=>{
                    return createList(newModelList);
                })
            })
        })
    }
    moveUpOneStep(){
        this.transition(()=>{
            const vmMap = this.getTreeStuctrueSelectedViewModels();
            Object.keys(vmMap).forEach((id)=>{
                const {parent,childrenMap} = vmMap[id]
                const newModelList:BaseModel[] = []
                const parentModel = parent.getModel();
                let needAppendList:BaseModel[];
                parent.children.viewModelList.forEach((vm)=>{
                    const vmModel = vm.getModel();
                    const vmId = vmModel.get('id',null);
                    const derefModel = vmModel.deref(null)
                    if(childrenMap[vmId] == null){
                        newModelList.push(derefModel)
                        if(needAppendList){
                            newModelList.push(...needAppendList);
                            needAppendList = null;
                        }
                    }else{
                        if(needAppendList == null){needAppendList = []}
                        needAppendList.push(derefModel);
                    }
                })
                if(needAppendList){
                    newModelList.push(...needAppendList)
                    needAppendList = null
                }
                parentModel.updateIn(['children'],null,()=>{
                    return createList(newModelList);
                })
            })
        })
    }


    updateModelPosition(data:IPos):void{
        const vms = this.getAllSelectedViewModels();
        this.transition(()=>{
            vms.forEach((vm)=>{
                vm.getModel().updateIn(['extra','position'],null,(oldPos:BaseModel)=>{
                    //@ts-ignore
                    return oldPos.merge(WrapData(data))
                })
            })
        })
    }
    updateModelStyle(data:Partial<CSSStyleDeclaration>):void{
        const vms = this.getAllSelectedViewModels();
        this.transition(()=>{
            vms.forEach((vm)=>{
                vm.getModel().updateIn(['props','style','value'],null,(oldVal:BaseModel)=>{
                    //@ts-ignore
                    return oldVal.merge(WrapData(data))
                })
            })
        })
    }
    updateModelProps(key:string,data:any):void{
        this.updateModelPropsByKeyPath([key],data);
    }
    updateModelPropsByKeyPath(keys:string[],data:any):void{
        const vms = this.getAllSelectedViewModels();
        this.transition(()=>{
            vms.forEach((vm)=>{
                vm.getModel().updateIn(['props',...keys],null,(oldVal:BaseModel)=>{
                    //@ts-ignore
                    return oldVal.merge(WrapData(data))
                })
            })
        })
    }
}