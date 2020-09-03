
// import {ViewAttribute} from './type';
import {baseModel2Model,ModelType,modelIsRoot, modelIsArtboard} from 'free-canvas-shared'
import {BaseModel,WrapData,isEqual} from './index'
import {Model} from './model';
import {Movable,ArtBoardMovable} from './movable';
import {IViewModel,IViewModelCollection,ViewModelOptions} from './type'
import { OperationPos } from '../core/operation/pos';

// const MINI_NUMBER = 0.0000000001

// function fixPercent(percent:number){
//     return percent < MINI_NUMBER ? MINI_NUMBER : percent
// }

function fixData(val:number){
    return Math.floor(val);
}

export class ViewModelCollection implements IViewModelCollection{
    viewModelList:ViewModel[]
    constructor(private _parent:ViewModel,private _models:BaseModel,private _options:ViewModelOptions){
        
        const viewModels:any[] = []
        //@ts-ignore
        _models.forEach((model)=>{
            const viewModel = new ViewModel(model,_parent,_options)
            viewModels.push(viewModel);
        })
        this.viewModelList = viewModels;
    }
    didUpdate(){
        this.viewModelList.forEach((vm)=>{
            vm.onDidUpdate();
        })
    }
    didMount(){
        this.viewModelList.forEach((vm)=>{
            vm.children && vm.children.didMount()
            vm.onDidMount();
        })
    }
    update(newModels:BaseModel){
        let index = 0;
        let modelIndex = 0;
        const newModelList = []
        for(;index < this.viewModelList.length; index++){
            const item = this.viewModelList[index];
            //@ts-ignore
            const newModel = newModels.get(modelIndex);
            if(newModel){
                const prevModel = item.getModel();
                if(prevModel.get('id',null) !== newModel.get('id',null)){ //当次数据按照顺序复用原来ID一致的数据，确保顺序一致
                    // console.log('id ==> ',prevModel.get('id',null),newModel.get('id',null));
                    item.remove();
                    continue;
                    // newModelList.push(new ViewModel(newModel,this._parent,this._options))
                }else{
                    item.update(newModel);
                    newModelList.push(item);
                }
            }else{
                item.remove();
            }
            modelIndex++;
        }
        this.viewModelList = newModelList;
        for(; modelIndex < newModels.size; modelIndex++){
            //@ts-ignore
            const newModel = newModels.get(modelIndex);
            const newViewModel = new ViewModel(newModel,this._parent,this._options);
            this.viewModelList.push(newViewModel);
            newViewModel.didMount();
        }
        this._models = newModels;
    }
}




export class ViewModel implements IViewModel{
    children:IViewModelCollection
    view:Movable
    _rect:OperationPos
    modelType:ModelType
    // isRoot:boolean
    // isGroup:boolean
    constructor(public model:BaseModel,private _parent:ViewModel,private _options:ViewModelOptions){
        // this.isRoot = model.get('isRoot',false)
        // this.isGroup = model.get('isGroup',false);
        this.modelType = model.get('type',null);
        const MovableClass = modelIsArtboard(this.modelType) ? ArtBoardMovable : Movable
        this.view = new MovableClass(baseModel2Model(model),Object.assign({},_options || {},{
            modelType:this.modelType,
            id:model._keyPath,
            vm:this,
            isChild:_parent != null && !modelIsRoot(_parent.modelType) && !modelIsArtboard(_parent.modelType),
            excute:this.excute.bind(this)
        }))
        //@ts-ignore
        this.children = createViewModels(this,this.getModel().get('children'),this._options);

        _parent && _parent.appendChild(this)
        this.view.mount();
        this._options.addViewModel(this);
    }
    didMount(){
        this.children && this.children.didMount();
        this.onDidMount();
    }
    appendChild(viewModel:ViewModel){
        this.view.appendChild(viewModel.view);
    }
    excute(type:number,data:any[]){
        this._options.commander.excute(type,{
            data:data,
            vm:this
        }); 
    }
    getView(){
        return this.view;
    }
    // static _getViewModelByXY(x:number,y:number,vm:IViewModel):IViewModel{
    //     const children = vm.children;
    //     if(children == null) return;
    //     const {viewModelList} = children
    //     for(let i = 0; i < viewModelList.length ; i++){
    //         const cvm = viewModelList[i];
    //         if(cvm.getRect().include(x,y)){
    //             return cvm
    //         }else{
                
    //         }
    //     }
    // }
    getViewModelByXY(x:number,y:number):IViewModel{
        const {left,top} = this._options.getRect();
        const curLeft = x - left,curTop = y - top;
        if(this.children == null) return;
        let stack = [].concat(this.children.viewModelList);
        while(stack.length > 0){
            const curVm = stack.pop();
            if(curVm.getRect().include(curLeft,curTop)){
                return curVm
            }else{
                if(curVm.children){
                    const childVms = [].concat(curVm.children.viewModelList);
                    stack.push(...childVms);
                }
            }
        }
        return
    }
    getParent(){
        return this._parent;
    }
    getTypeParent(type:ModelType):IViewModel{
        const {_parent} = this;
        if(_parent == null) return;
        return _parent.modelType === type ? _parent : _parent.getTypeParent(type)
    }
    isChildren(vm:IViewModel):boolean{
        if(modelIsRoot(this.modelType)) return false;
        const {_parent} = this;
        if(_parent == vm) return true;
        return _parent.isChildren(vm);
    }
    // isInside(vm:IViewModel):boolean{
    //     const {left:curLeft,top:curTop} = this._rect;
    //     const {left,top,width,height} = vm.getRect();
    //     return (curLeft > left && curLeft < left + width && curTop > top && curTop < top + height);
    // }
    // moveLeft(diffx:number):void{
    //     const {_rect} = this;
    //     _rect.left += diffx;
    //     _rect.width -= diffx;
    //     this.view.updatePosAndSize(_rect)
    // }
    // moveTop(diffy:number):void{

    // }
    // moveRight(diffx:number):void{

    // }
    // moveBottom(diffy:number):void{

    // }
    // canMove(){
    //     return this.view.canMove
    // }
    // disableMove(){
    //     this.view.canMove = false;
    // }
    // onPostionChange(left:number,top:number){
    //     const model = this.model;
    //     model.updateIn(['extra','position'],null,()=>{
    //         return WrapData({
    //             left,
    //             top
    //         })
    //     })
    // }
    // onFocus(){
    //     this.model.updateIn(['extra','isSelect'],null,()=>{
    //         return true
    //     })
    // }
    // onBlur(){
    //     this.model.updateIn(['extra','isSelect'],null,()=>{
    //         return false
    //     })
    // }
    updateRect(){ //更新当前viewModel 是相对画布的坐标 todo 当isGroup的时候需要动态更新
        const pos = this._options.getRect();
        const cur = this.view.getBoundingClientRect();
        this._rect = new OperationPos(fixData(cur.left - pos.left),fixData(cur.top - pos.top),fixData(cur.width),fixData(cur.height),(rect)=>{
            this.view.updatePosAndSize(this.getRelativeRect(rect)) //当更新的时候需要还原到父容器下的相对坐标
        })
    }
    changeRect(target:string,diffx:number,diffy:number){
        // const curRect = this._rect;
        // const hPercent = fixPercent((diffx + curRect._width) / curRect._width),vPercent = fixPercent((diffy + curRect._height) / curRect._height);
        // console.log('hPercent :',hPercent,diffx);
        // const curWidth = curRect.width,curHeight = curRect.height;
        //@ts-ignore
        this._rect[target](diffx,diffy);
        this.children && this.children.viewModelList.forEach((child)=>{
            ViewModel.changeRectByPercent(`${target}Percent`,child,this._rect)
        })
    }
    // setRect(rect:OperationPos){
    //     this._rect = rect;
    // }
    static changeRectByPercent(target:string,vm:IViewModel,rootPos:OperationPos):void{
        const vmRect = vm.getRect();
        const parentPos = vm.getParentRect();
        // const pos = vm.getRelativeRect(vmRect,parentPos);
        // const curWidth = vmRect.width,curHeight = vmRect.height;
        //@ts-ignore
        // vmRect[target](parentPos,diffX,diffY)
        vmRect[target](parentPos,rootPos)
        //需要重新计算 
        // const childHPercent = fixPercent(newRect.width / vmRect.width),childVPercent = fixPercent(newRect.height / vmRect.height);
        vm.children && vm.children.viewModelList.forEach((child)=>{
            ViewModel.changeRectByPercent(target,child,rootPos);
        })
        // vm.setRect(newRect);
    }
    changePosition(diffx:number,diffy:number){
        this._rect.changeLeftAndTop(diffx,diffy);
    }
    // updateRectByWheel(scrollX:number,scrollY:number){
    //     this._rect.moveLeftAndTop(scrollX,scrollY,true);
    //     this.children && this.children.viewModelList.forEach((vm)=>{
    //         vm.updateRectByWheel(scrollX,scrollY);
    //     })
    // }
    getRect(){ //相对rect
        if(this._rect == null) {
            this.updateRect();
        }
        return this._rect
    }
    getParentRect():OperationPos{
        const {_parent,_options} = this;
        let curRect:OperationPos;
        if(_parent == null || modelIsRoot(_parent.modelType)){
            curRect = OperationPos.createEmpty();
        }else{
            curRect = _parent.getRect();
        }
        return curRect;
    }
    getRelativeRect(rect:OperationPos,parentRect?:OperationPos){
        if(!parentRect){
            parentRect = this.getParentRect();
        }
        // const diffx = parentRect.getDiffX(),diffy = parentRect.getDiffY();
        return {
            left:rect.left  - parentRect.left ,
            top:rect.top  - parentRect.top,
            width:rect.width,
            height:rect.height,
            // _left:rect._left - parentRect._left,
            // _top:rect._top - parentRect._top,
            // _width:
            // _height:rect._height
        }
        // return new OperationPos(rect.left  - curRect.left,rect.top  - curRect.top,rect.width,rect.height)
    }
    getAbsRect(){
        const pos = this._options.getRect();
        return this._rect.moveLeftAndTop_immutation(pos.left,pos.top)
    }
    onDidUpdate(){
        this.view.onDidUpdate();
        this.children && this.children.didUpdate();
        // console.log(`【${this.model.get('id',null)}】updated!`);
        this.updateRect();
        // this._rect = this.view.getRect();
    }
    onDidMount(){
        this.view.onDidMount();
        // console.log(`【${this.model.get('id',null)}】mounted!`);
        this.updateRect();
        // ViewModel.updateChildrenPosAndSize(this);
    }
     
    // static updateChildrenPosAndSize(vm:IViewModel){
    //     const parent = vm.getParent();
    //     if(parent == null || parent.isRoot) return;
    //     const {width,height} = parent.getRect();
        
    // }
    remove(){  //销毁
        if(this._parent == null) return;
        // this._parent.view.removeChild(this.view);
        this.view.removeFrom(this._parent.view);
        this._options.removeViewModel(this);
    }
    getModel(){
        return this.model;
    }
    update(model:BaseModel){
        if(model == null) {
            this.remove();
            return;
        };
        const prevModel = this.model;
        const prevId = prevModel.get('id',null)
        const curId = model.get('id',null)
        const idNotEqual = prevId !== curId
        const needUpdate = idNotEqual || !isEqual(model,prevModel)
        if(needUpdate){
            this.view.update(model.searialize());
        }
        this.model = model;
        if(idNotEqual){
            this._options.updateViewModel(prevId,this);
        }
        this.modelType = model.get('type',false)
        this.view.setModelType(this.modelType);
        const modelChildren = model.get('children',WrapData([]));
        if(this.children){
            this.children.update(modelChildren);
        }else if(modelChildren && modelChildren.size > 0){
            this.children = createViewModels(this,modelChildren,this._options);
        }
        if(needUpdate){
            this.onDidUpdate();
        }
    }
}

function createViewModels(parent:ViewModel,models:BaseModel,_options:ViewModelOptions):ViewModelCollection{
    if(models == null) return;
    // let parentViewModel = parent || new ViewModel(new FragmentView(mountNode),null);
    const collection = new ViewModelCollection(parent,models,_options);
    // if(mountNode && parentViewModel.view instanceof FragmentView){
    //     mountNode.appendChild(parentViewModel.view.getFragmentAndChange());
    // }
    return collection;
} 

export function createViewModel(parent:ViewModel,model:BaseModel,_options:ViewModelOptions){
    if(model == null) return;
    const viewModel = new ViewModel(model,parent,_options);
    return viewModel;
}

