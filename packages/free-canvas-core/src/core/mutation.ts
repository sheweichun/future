
import {Store,WrapData, BaseModel,isEqual,createList,createMap} from '../render/index'
import {Commander} from './commander'
import { IViewModel } from "../render/type";
import {COMMANDERS,Utils} from 'free-canvas-shared';
import {createGroupModel} from '../render/index'
import {CanvasEvent,EventHandler} from '../events/event'
import {Model} from '../render/model';
import {IOperation} from './operation/type';
// import {isEqual} from '../render/dsl/store'
import { OperationPos } from './operation/pos';
import {MutationOptions} from './type';
// import {DRAG_OVER} from '../utils/constant';

const {encode,encode2ShortId} = Utils
type OnSelected = (data:{x:number,y:number})=>void

type BaseModelAndPos = {
    pos:OperationPos,
    model:BaseModel
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
            const ppPos = parentVm && !parentVm.isRoot ? parentVm.getRect() : {left:0,top:0};
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


export class Mutation extends EventHandler{
    private _onSelectedFn:OnSelected
    private _onSelectStartFn:OnSelected
    private _onSelectMoveFn:OnSelected
    private _onUnselectFn:OnSelected
    private _isDragOver:boolean = false
    private _viewModelMap:Map<string,IViewModel> = new Map()
    private _operation:IOperation
    private _copyTarget:BaseModel[]
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
        this._viewModelMap.set(encode(viewModel.getModel()._keyPath),viewModel);
    }
    removeViewModel(viewModel:IViewModel){
        this._viewModelMap.delete(encode(viewModel.getModel()._keyPath))
    }
    setOperation(operation:IOperation){
        this._operation = operation;
    }
    _getSelectedBaseModels(){
        const arr:BaseModel[] = [];
        this.reduceSelectedKeyPath((keyPath:string)=>{
            const item = this._viewModelMap.get(keyPath);
            if(item){
                arr.push(item.getModel())
            }
        })
        return arr;
    }
    getSelectedViewModels(){
        const arr:IViewModel[] = [];
        this.reduceSelectedKeyPath((keyPath:string)=>{
            const item = this._viewModelMap.get(keyPath);
            if(item){
                arr.push(item)
            }
        })
        return arr;
    }
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
        this._copyTarget = this._getSelectedBaseModels();
    }
    paste(){
        if(this._copyTarget == null) return;
        const addKeyPaths:string[][] = []
        this.transition(()=>{
            this._onUnSelected();
            const dslData = this.getDSLData();
            const originPath = dslData._keyPath;
            dslData.update('children',(old:BaseModel)=>{
                const oldSize = old.size;
                //@ts-ignore
                return old.push(...this._copyTarget.map((item:BaseModel,index:number)=>{
                    const cloneData = item.searialize();
                    const {position} = cloneData.extra;
                    cloneData.extra.position = Object.assign({},position,{
                        left : position.left + 20,
                        top: position.top + 20
                    })
                    cloneData.extra.isSelect = true;
                    addKeyPaths.push([].concat(originPath,['children',oldSize + index]));
                    return WrapData(cloneData);
                }));
            })
            this.addKeyPath(...addKeyPaths);
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
        this.removeModels(this.getSelectedViewModels())
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
    eachModelAndVm(curModel:BaseModel,vm:IViewModel,fn:(item:BaseModel,vm:IViewModel)=>boolean){
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
    addKeyPath(...keyPaths:any[][]){
        this.getSelectedKeyPaths().push(...(keyPaths.map((item)=>{
            return encode(item)
        })));
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
        let curModel = target
        if(vms.length === 0) return curModel;
        const children = curModel.get('children',null);
        if(children == null || children.size === 0) return curModel; 
        let newChilds:any[] = [];
        // console.log('before child size :',children.size);
        for(let j = 0; j < children.size; j++){
            let child = children.get(j);
            let isShoted = false,i;
            for(i = 0; i < vms.length; i++){
                const vm = vms[i];
                if(isEqual(child,vm.getModel())){
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
            return ret.push(this._removeModelsFromEachModel(vms,ch).deref(null));
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
                const isGroup = curModel.get('isGroup',false);
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
                        selectedKeys.push(encode(item._keyPath))
                    }
                })
            })
            const state = this._store.currentState
            state.updateIn(['selectedKeyPaths'],null,()=>{ //更新选中项
                return createList(selectedKeys)
            })
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
            childs.push({
                pos:vm.getRect(),
                model:model.deref(null)
            });
            parentModel.updateIn(['children'],null,(parentModelChild:any)=>{
                const newChilds:BaseModel[] = []
                for(let i = 0; i < parentModelChild.size; i++){
                    const curParentChild = parentModelChild.get(i);
                    if(!isEqual(curParentChild,model)){
                        newChilds.push(curParentChild);
                    }
                }
                return createList(newChilds);
            })
        })
        
        // const dslData = this.getDSLData();
        let targetIndex:number;
        const targetParent = this._store.getRealFromPath(deepKeyPath,null);
        if(targetParent == null) return;
        const childDsl = targetParent.get('children');
        // const parentPos = targetParent.getIn(['extra','position']);
        const parentRect = deepVm.isRoot ? {left:0,top:0} : deepVm.getRect();
        const groupModel = createGroupModel(pos.left - parentRect.left,pos.top - parentRect.top,pos.width,pos.height);
        targetParent.updateIn(['children'],(old:any)=>{
            targetIndex = old.size;
            const ret = old.push(WrapData(groupModel).withMutations((mutModel:BaseModel)=>{
                return mutModel.set('children',createList(childs.map((ch:BaseModelAndPos)=>{
                    const {model,pos:modelPos} = ch;
                    return model.updateIn(['extra','position'],null,(oldPosition:any)=>{
                        return createMap({
                            left:modelPos.left - pos.left,
                            top:modelPos.top - pos.top,
                            width:modelPos.width,
                            height:modelPos.height
                        })
                    })
                })))
            }))
            return ret;
        });
        // console.log('childKeyPath :',childKeyPath,targetIndex);
        const state = this._store.currentState
        state.updateIn(['selectedKeyPaths'],null,()=>{ //更新选中项
            return createList([encode([...childDsl._keyPath,targetIndex])])
        })
       })
    }
    removeModels(vms:IViewModel[]){
        const dslData = this.getDSLData();
        this.transition(()=>{
            this._removeModelsFromEachModel([].concat(vms),dslData);
        })
    }
    addModel(data:Model){
        if(data == null) return;
        let target:BaseModel;
        data.extra.isSelect = true;
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
        this.addKeyPath(target._keyPath);
        return encode2ShortId(target._keyPath)
    }
    onPostionChanges(val:{vms:IViewModel[],data:{left:number,top:number}}){
        const {vms,data} = val
        this.transition(()=>{
            vms.forEach((vm)=>{
                vm.getModel().updateIn(['extra','position'],null,(pos:any)=>{
                    return WrapData({
                        left:pos.get('left') + data.left,
                        top:pos.get('top') + data.top,
                        width:pos.get('width'),
                        height:pos.get('height')
                    })
                })
            })
        })
    }
    // changePosAndSize(vms:IViewModel[],data:{left:number,top:number,width:number,height:number}){
    changePosAndSize(vms:IViewModel[]){
        this.transition(()=>{
            vms.forEach((vm)=>{
                //@ts-ignore
                const oldVm = vm.getModel();
                const {left,top,width,height} = vm.getRelativeRect(vm.getRect());
                oldVm.withMutations((md:any)=>{
                    return md.setIn(['extra','position'],WrapData({left,top,width,height}))
                    // .updateIn(['style'],(nStyle:any)=>{
                    //     return nStyle.set('width',`${width}px`).set('height',`${height}px`);
                    // })
                    // console.log('data :',data);
                })
            })
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
    updateSelectVmsByPos(data:BaseModel,target:IViewModel,pos:OperationPos){  //选择框框选选中组件
        this.notRecord(()=>{
            this.eachModelAndVm(data,target,(curModel:BaseModel,vm:IViewModel)=>{
                const isRoot = vm.isRoot;
                if(isRoot) return true;
                const vmPos = vm.getAbsRect();
                const shouldSelect = vmPos.isOverlap(pos);
                const curSelect = curModel.getIn(['extra','isSelect'],null);
                if(curSelect !== shouldSelect){
                    if(shouldSelect){
                        this.addKeyPath(curModel._keyPath);
                    }else{
                        this.removeKeyPath(encode(curModel._keyPath));
                    }
                    curModel.updateIn(['extra','isSelect'],null,()=> shouldSelect);
                }
                return true;
            })
        })
    }
    _onModelSelected(target:BaseModel,data:{needKeep:boolean,x:number,y:number,noTrigger?:boolean}){ //选中组件
        const {needKeep} = data;
        this.each(this.getDSLData(),(curModel:BaseModel)=>{
            const isSelected = curModel.getIn(['extra','isSelect'],false)
            // console.log('isSelected :',isSelected);
            //todo 如果数据都一致的话会存在重复的问题
            if(isEqual(curModel,target)){
                if(isSelected && needKeep && this.keyPathsIsNotEmpty()){
                    this.removeKeyPath(encode(curModel._keyPath));
                    curModel.updateIn(['extra','isSelect'],null,()=>false)
                }else if(!isSelected){
                    this.addKeyPath(curModel._keyPath);
                    curModel.updateIn(['extra','isSelect'],null,()=>true)
                }
            }else if(!needKeep && isSelected){
                this.removeKeyPath(encode(curModel._keyPath));
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
}