
import {Store,WrapData, BaseModel,isEqual,createList,createMap} from '../render/index'
import {Commander} from './commander'
import { COMMANDERS, IViewModel } from "../render/type";
import {createGroupModel} from '../render/index'
// import {isEqual} from '../render/dsl/store'
import {encode,decode} from './util'
import { OperationPos } from './operation/pos';


type OnSelected = (startX:number,startY:number)=>void


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

function extractEachModelAndRemoveChild(model:BaseModel,vm:IViewModel,ret:BaseModel[]=[]){
    const children = model.get('children',null);
    const vmChildren = vm.children;
    if(children == null || children.size === 0) return ret;
    children.forEach((child:BaseModel,index:number)=>{
        const curVm = vmChildren.viewModelList[index];
        // curVm.getView().mark();
        const curRect = curVm.getRect();
        const newChild = child.withMutations((mutChild:BaseModel)=>{
            return mutChild.setIn(['extra','position'],createMap({
                left:curRect.left,
                top:curRect.top
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


export class Mutation{
    private _onSelected:OnSelected
    constructor(private _store:Store,private _commander:Commander){
    }
    register(){
        this._commander.register(COMMANDERS.POSITIONCHANGE,this.onPostionChanges,this);
        this._commander.register(COMMANDERS.SELECTED,this.onSelected,this);
        this._commander.register(COMMANDERS.UNSELECTED,this.onUnSelected,this);
    }
    // removeSelectedKeyPath(keyPath:any[]){

    // }
    // getSelected(){
    //     const selectedKeyPaths = this._getSelectedKeyPaths();
    //     const currentState = this._store.currentState;
    //     const ret:BaseModel[] = [];
    //     selectedKeyPaths.forEach((keyPath:string)=>{
    //         const item = currentState.getIn(decode(keyPath));
    //         ret.push(item)
    //     })
    //     return ret;
    // }
    reduceSelectedKeyPath(fn:(keyPath:string)=>void){
        const selectedKeyPaths = this._getSelectedKeyPaths();
        selectedKeyPaths.forEach((keyPath:string)=>{
            fn(keyPath)
        })
    }
    getDSLData(){
        return this._store.currentState.get('data')
    }
    private _getSelectedKeyPaths(){
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
    addKeyPath(keyPath:any[]){
        this._getSelectedKeyPaths().push(encode(keyPath));
    }
    keyPathsIsNotEmpty(){
        return this._getSelectedKeyPaths().size > 0
    }
    clearKeyPath(){
        this._store.currentState.updateIn(['selectedKeyPaths'],()=>createList([]))
    }
    removeKeyPath(keyPathStr:string){
        const selectedKeyPaths = this._getSelectedKeyPaths();
        const targetIndex = selectedKeyPaths.findIndex((value:any,index:number)=>{
            return value === keyPathStr
        })
        if(targetIndex >= 0){
            selectedKeyPaths.delete(targetIndex);
        }
        return selectedKeyPaths;
    }
    // onPostionChange(vm:IViewModel,data:{left:number,top:number}){
    //     console.log('data:',data);
    //     vm.getModel().updateIn(['extra','position'],null,(pos:any)=>{
    //         return WrapData({
    //             left:pos.get('left') + data.left,
    //             top:pos.get('top') + data.top
    //         })
    //     })
    // }
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
                const parentModel = vm.getParent().getModel();
                const curModel = vm.getModel();
                const models = extractEachModelAndRemoveChild(curModel,vm); //提取子节点，并重新计算定位
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
    group(vms:IViewModel[],pos:OperationPos){ //编组
        if(vms == null || vms.length <= 1) return 
        // let left:number,top:number,width:number,height:number
        // let initFlag = false;
       this.transition(()=>{
        const groupModel = createGroupModel(pos.left,pos.top,pos.width,pos.height);
        const childs:BaseModel[] = []
        vms.forEach((vm,index)=>{
            const parentVm = vm.getParent();
            if(parentVm == null) return;
            const parentModel = parentVm.getModel()
            const model = vm.getModel();
            childs.push(model.deref(null));
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
        const dslData = this.getDSLData();
        let targetIndex:number;
        const childDsl = dslData.get('children');
        dslData.updateIn(['children'],(old:any)=>{
            targetIndex = old.size;
            const ret = old.push(WrapData(groupModel).withMutations((mutModel:BaseModel)=>{
                return mutModel.set('children',createList(childs.map((ch:BaseModel)=>{
                    return ch.updateIn(['extra','position'],null,(oldPosition:any)=>{
                        const oldLeft = oldPosition.get('left');
                        const oldTop = oldPosition.get('top');
                        return createMap({
                            left:oldLeft - pos.left,
                            top:oldTop - pos.top
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
        
        // this.each(dslData,(curModel:BaseModel)=>{
        //     if(curModel.getIn(['extra','isSelect'],false)){
        //         curModel.updateIn(['extra','isSelect'],null,()=>false)
        //         return true;
        //     }
        //     return true;
        // })
        // const ret = fn(curModel);
        // if(!ret) return;
        // const children = curModel.get('children',null);
        // if(children){
        //     children.forEach((child:BaseModel)=>{
        //         this.each(child,fn);
        //     })
        // }
    }
    onPostionChanges(vms:IViewModel[],data:{left:number,top:number}){
        this.transition(()=>{
            vms.forEach((vm)=>{
                vm.getModel().updateIn(['extra','position'],null,(pos:any)=>{
                    return WrapData({
                        left:pos.get('left') + data.left,
                        top:pos.get('top') + data.top
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
                    return md.setIn(['extra','position'],WrapData({left,top}))
                    .updateIn(['style'],(nStyle:any)=>{
                        return nStyle.set('width',`${width}px`).set('height',`${height}px`);
                    })
                    // console.log('data :',data);
                })
            })
        })
    }
    onUnSelected(){
        if(!this.keyPathsIsNotEmpty()) return;
        this.notRecord((store)=>{
            this.each(this.getDSLData(),(curModel:BaseModel)=>{
                if(curModel.getIn(['extra','isSelect'],false)){
                    curModel.updateIn(['extra','isSelect'],null,()=>false)
                    return true;
                }
                return true;
            })
            this.clearKeyPath();
        })
    }
    registerOnSelect(fn:OnSelected){
        this._onSelected = fn;
    }
    onSelected(vm:IViewModel,data:{needKeep:boolean,x:number,y:number,noTrigger?:boolean}){
        const {needKeep,x,y,noTrigger} = data;
        // console.log('needKeep :',needKeep);
        this.notRecord((store)=>{
            const target = vm.getModel();
            this.each(this.getDSLData(),(curModel:BaseModel)=>{
                const isSelected = curModel.getIn(['extra','isSelect'],false)
                // console.log('isSelected :',isSelected);
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
        });
        (!noTrigger && this._onSelected) && this._onSelected(x,y);
    }
}