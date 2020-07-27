
// import {ViewAttribute} from './type';
import {BaseModel,WrapData,isEqual} from './index'
import {Model} from './model';
import {Movable} from './movable';
import {IViewModel,IViewModelCollection,ViewModelOptions} from './type'
import { OperationPos } from '../core/operation/pos';

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
        const newModelList = []
        for(;index < this.viewModelList.length; index++){
            const item = this.viewModelList[index];
            //@ts-ignore
            const newModel = newModels.get(index);
            if(newModel){
                item.update(newModel);
                newModelList.push(item);
            }else{
                item.remove();
            }
        }
        this.viewModelList = newModelList;
        for(; index < newModels.size; index++){
            //@ts-ignore
            const newModel = newModels.get(index);
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
    isRoot:boolean
    constructor(public model:BaseModel,private _parent:ViewModel,private _options:ViewModelOptions){
        this.isRoot = model.get('isRoot',false)
        this.view = new Movable(model.searialize() as Model,Object.assign({},_options || {},{
            isRoot:this.isRoot,
            isChild:_parent != null && !_parent.isRoot,
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
        this._options.commander.excute(type,this,data);
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
            if(curVm.getRect().include(x,y)){
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
    isChildren(vm:IViewModel):boolean{
        if(this.isRoot) return false;
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
    updateRect(){ //更新当前viewModel 是相对画布的坐标
        // let pos:OperationPos;
        // if(_parent){
        //     pos = _parent.view.getBoundingClientRect()
        // }else{
        //     pos = _options.getRect();
        // }
        const pos = this._options.getRect();
        const cur = this.view.getBoundingClientRect();
        this._rect = new OperationPos(cur.left - pos.left,cur.top - pos.top,cur.width,cur.height,(rect)=>{
            this.view.updatePosAndSize(this.getRelativeRect(rect)) //当更新的时候需要还原到父容器下的相对坐标
            // this.view.updatePosAndSize(rect);
        })
    }
    getRelativeRect(rect:OperationPos){
        const {_parent,_options} = this;
        const pos = _options.getRect();
        let curRect:OperationPos;
        if(_parent == null || _parent.isRoot){
            curRect = _options.getRect();
        }else{
            curRect = _parent.view.getBoundingClientRect();
        }
        return {
            left:rect.left + pos.left - curRect.left ,
            top:rect.top + pos.left - curRect.top,
            width:rect.width,
            height:rect.height
        }
    }
    getAbsRect(){
        const pos = this._options.getRect();
        return this._rect.moveLeftAndTop_immutation(pos.left,pos.top)
    }
    getRect(){
        return this._rect
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
    }
    changePosition(diffx:number,diffy:number){
        this.view.move(diffx,diffy);
    }
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
        const needUpdate = !isEqual(model,prevModel)
        if(needUpdate){
            this.view.update(model.searialize());
        }
        this.model = model;
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

