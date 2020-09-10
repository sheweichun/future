
// import {ViewAttribute} from './type';
import {baseModel2Model,ModelType,modelIsRoot, modelIsArtboard} from 'free-canvas-shared'
import {BaseModel,WrapData,isEqual} from './index'
import {Model} from './model';
import {Movable,ArtBoardMovable} from './movable';
import {IViewModel,IViewModelCollection,ViewModelOptions, IMovable} from './type'
import { OperationPos } from '../core/operation/pos';

// const MINI_NUMBER = 0.0000000001

// function fixPercent(percent:number){
//     return percent < MINI_NUMBER ? MINI_NUMBER : percent
// }

function fixData(val:number){
    return Math.floor(val);
}
export class ViewModelCollection implements IViewModelCollection{
    viewModelList:IViewModel[]
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
    appendViewModel(vm:IViewModel){
        this.viewModelList.push(vm)
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
                // if(newModel.get('id',null) === '113'){
                //     count++;
                //     console.log('id ==> ',prevModel.get('id',null),newModel.get('id',null));
                //     if(count === 3){
                //         debugger;
                //     }
                // }
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
    _initialParent:IViewModel
    // isRoot:boolean
    // isGroup:boolean
    constructor(public model:BaseModel,private _parent:IViewModel,private _options:ViewModelOptions){
        // this.isRoot = model.get('isRoot',false)
        // this.isGroup = model.get('isGroup',false);
        this.modelType = model.get('type',null);
        this._initialParent = _parent;
        const MovableClass = modelIsArtboard(this.modelType) ? ArtBoardMovable : Movable
        this.view = new MovableClass(baseModel2Model(model),Object.assign({},_options || {},{
            modelType:this.modelType,
            isOperating:this._options.isOperating,
            // id:model._keyPath,
            vm:this,
            isChild:_parent != null && !modelIsRoot(_parent.modelType) && !modelIsArtboard(_parent.modelType),
            excute:this.excute.bind(this)
        }))
        let childOption = this._options;
        if(modelIsArtboard(this.modelType)){
            childOption = Object.assign({},this._options,{
                artboardId:model.get('id',null)
            })
        }
        //@ts-ignore
        this.children = createViewModels(this,this.getModel().get('children'),childOption);

        _parent && _parent.appendChild(this)
        this.view.mount();
        this._options.addViewModel(this);
    }
    changeParent(parent:IViewModel){
        if(parent == null || parent.children == null) return;
        this._parent = parent;
        parent.children.viewModelList.push(this);
        this.view.updatePosAndSize(this.getRelativeRect(this._rect)) //当更改父容器的时候需要还原到新父容器下的相对坐标
        parent.appendChild(this);
        this.view.updateIsChild(
            parent != null && !modelIsRoot(parent.modelType) && !modelIsArtboard(parent.modelType)
        )
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
    getInitialParent(){
        return this._initialParent
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
    removeChildViewModel(vm:IViewModel){
        const {children} = this;
        if(children == null) return;
        const {viewModelList} = children;
        for(let i = 0 ; i < viewModelList.length; i++){
            const curVm = viewModelList[i];
            if(curVm === vm){
                viewModelList.splice(i,1);
                vm.separate()
            }
        }
    }
    
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
    changeArtboardId(artboardId:string){
        this._options.artboardId = artboardId;
        if(this.children){
            this.children.viewModelList.forEach((vm)=>{
                vm.changeArtboardId(artboardId);
            })
        }
    }
    getArtboard():IViewModel{
        const {artboardId,getViewModel} = this._options
        if(artboardId == null) return null;
        return getViewModel(artboardId)
    }
    changePosition(diffx:number,diffy:number):boolean{ //todo 由于在实际拖动以及最终释放之后是分别计算转换逻辑的，需要确保最终行为一致性
        // console.log('parent :',this._parent.modelType,this._initialParent.modelType,this._parent === this._initialParent);
        const {artboardId,getViewModel,getArtboards,getRootViewModel} = this._options
        this._rect.changeLeftAndTop(diffx,diffy);
        if(modelIsArtboard(this.modelType)) return; //如果是画板就不需要走下面的逻辑
        if(artboardId != null){
            const artboard = getViewModel(artboardId);
            if(artboard == null) return
            const isOverlap = artboard.getRect().isOverlap(this._rect)
            if(!isOverlap){ //移动到顶层
                this._parent.removeChildViewModel(this);
                this.changeParent(getRootViewModel());
                this.changeArtboardId(null);
                return true;
                //todo 添加到顶层
            }
            return false;
        }
        const allArtboards = getArtboards({[artboardId]:true});
        for(let i = 0 ; i < allArtboards.length; i++){
            const curArtboard = allArtboards[i];
            if(curArtboard.getRect().isOverlap(this._rect)){ //移动到对应的artboard里面
                this._parent.removeChildViewModel(this);
                this.changeParent(curArtboard);
                this.changeArtboardId(curArtboard.getModel().get('id',null));
                return true;
            }
        }
        return false;
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
    remove(){  //销毁
        if(this._parent == null) return;
        this.view.removeFrom(this._parent.getView());
        this._options.removeViewModel(this);
    }
    separate(){
        if(this._parent == null) return;
        this.view.separate(this._parent.getView());
    }
    getModel(){
        return this.model;
    }
    update(model:BaseModel){
        this._initialParent = this._parent;
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

