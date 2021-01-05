
// import {ViewAttribute} from './type';
import {baseModel2Model,ModelType,modelIsRoot, modelIsArtboard,IPos,IViewModel,IViewModelCollection,ViewModelOptions, CanvasEvent} from 'free-canvas-shared'
import {BaseModel,WrapData,isEqual} from './index'
// import {Model} from './model';
import {MOVABLE_ITERATOR_CLASSNAME,MOVABLE_ITERATOR_HOVER_CLASSNAME} from '../utils/constant'
import {getOverlapArtboard, getWrapSize, stopPropagation} from '../utils/index'
import {Movable,ArtBoardMovable} from './movable'; 
// import {IViewModel,IViewModelCollection,ViewModelOptions} from './type'
import { OperationPos } from '../core/operation/pos';

// const MINI_NUMBER = 0.0000000001

// function fixPercent(percent:number){
//     return percent < MINI_NUMBER ? MINI_NUMBER : percent
// }

// function fixData(val:number){
//     return Math.floor(val);
// }
export class ViewModelCollection implements IViewModelCollection{
    viewModelList:IViewModel[]
    static createEmptyViewModelCollection(parent:IViewModel,options:ViewModelOptions){
        return new ViewModelCollection(parent,null,options)
    }
    constructor(private _parent:IViewModel,private _models:BaseModel,private _options:ViewModelOptions){
        
        const viewModels:any[] = []
        //@ts-ignore
        _models && _models.forEach((model)=>{
            const viewModel = new ViewModel(model,_parent,_options)
            viewModels.push(viewModel);
        })
        this.viewModelList = viewModels;
    }
    mount(el:HTMLElement){
        const {viewModelList} = this
        viewModelList && viewModelList.forEach((vm)=>{
            el.appendChild(vm.getRootEl())
        })
    }
    get size(){
        return this.viewModelList.length;
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
    updateLocalData(data:any){
        this.viewModelList.forEach((vm)=>{
            vm.updateLocalData(data);
        })
    }
    remove(){
        this.viewModelList.forEach((vm)=>{
            vm.remove()
        })
    }
    update(newModels:BaseModel,forceUpdate?:boolean){
        let index = 0;
        let modelIndex = 0;
        const addModels = [];
        const removeModels = []
        const newModelList = []
        for(;index < this.viewModelList.length; index++){
            const item = this.viewModelList[index];
            //@ts-ignore
            const newModel = newModels && newModels.get(modelIndex);
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
                    removeModels.push(item)
                    continue;
                    // newModelList.push(new ViewModel(newModel,this._parent,this._options))
                }else{
                    item.update(newModel,forceUpdate);
                    newModelList.push(item);
                }
            }else{
                item.remove();
                removeModels.push(item)
            }
            modelIndex++;
        }
        this.viewModelList = newModelList;
        if(newModels){
            for(; modelIndex < newModels.size; modelIndex++){
                //@ts-ignore
                const newModel = newModels.get(modelIndex);
                const newViewModel = new ViewModel(newModel,this._parent,this._options);
                this.viewModelList.push(newViewModel);
                addModels.push(newViewModel);
                newViewModel.didMount();
            }
        }
        this._models = newModels;
        return {
            addModels,
            removeModels
        }
    }
}

class SilentViewModel{
    private _vmCollection:ViewModelCollection
    private _el:HTMLElement
    constructor(private _parentEl:HTMLElement,modelChildren:BaseModel,_size:{width:number,height:number},private _option:ViewModelOptions){
        this._vmCollection = createViewModels(null,modelChildren,_option)
        const div = document.createElement('div');
        div.className = MOVABLE_ITERATOR_CLASSNAME
        div.setAttribute('style',`position:relative;width:${_size.width}px;height:${_size.height}px`)
        this._el = div
        this._vmCollection.mount(div);
        // this.onMouseEnter = this.onMouseEnter.bind(this)
        // this.onMouseLeave = this.onMouseLeave.bind(this)
    }
    mount(){
        const {_el} = this;
        this._parentEl.appendChild(_el);
        _el.addEventListener(CanvasEvent.MOUSEDOWN,stopPropagation)
        // _el.addEventListener(CanvasEvent.MOUSELEAVE,this.onMouseLeave)
        // this._el.addEventListener(CanvasEvent.CLICK,(e)=>{
        //     debugger
        //     console.log('click!!');
        //     // stopPropagation(e)
        // })
    }
    update(modelChildren:BaseModel,size:{width:number,height:number},option:ViewModelOptions,forceUpdate:boolean){
        const {_vmCollection,_el} = this
        const {localData} = option
        _el.setAttribute('style',`position:relative;width:${size.width}px;height:${size.height}px`)
        _vmCollection.updateLocalData(localData);
        const {addModels,removeModels} = _vmCollection.update(modelChildren,forceUpdate);
        removeModels.forEach((vm)=>{
            const view = vm.getView();
            view.destroy()
            this._el.removeChild(view.el);
        })
        addModels.forEach((vm)=>{
            this._el.appendChild(vm.getRootEl())
        })
    }
    unmount(){
        const {_vmCollection,_parentEl,_el} = this
        _el.removeEventListener(CanvasEvent.MOUSEDOWN,stopPropagation)
        _vmCollection.remove()
        _parentEl.removeChild(this._el)
    }
}

interface SilentViewModelCollectionOpt{
    size:{width:number,height:number}
    listData:Array<any>
    modelChildren:BaseModel
}

class SilentViewModelCollection{
    private _vms:Array<SilentViewModel>
    private _listData:Array<any>
    constructor(private _parentEl:HTMLElement,private _getOption:(index:number)=>ViewModelOptions,_option:SilentViewModelCollectionOpt){
        const {size,listData,modelChildren} = _option
        const vms:Array<SilentViewModel> = [null]
        this._listData = listData
        listData.forEach((item,index)=>{
            if(index === 0){
                return
            }else{
                vms[index] = new SilentViewModel(_parentEl,modelChildren,size,this.getOption(index))
            }
        })
        this._vms = vms
    }
    getOption(index:number){
        const {_getOption} = this;
        const opt = _getOption(index)
        return Object.assign({},opt,{ //考虑复写没有问题，getoption可能会有isSilent,silentId
            isSilent:true,
            silentId:opt.silentId ? `${opt.silentId}-${index}` : index
        })
    }
    update(option:SilentViewModelCollectionOpt,forceUpdate:boolean){
        const {_listData,_vms,_getOption,_parentEl} = this
        const {modelChildren,size,listData:newListData} = option
        let newVms:Array<SilentViewModel> = [null]
        let i = 0 ;
        for(; i < _listData.length ; i++){
            if(i === 0) continue;
            const vm = _vms[i];
            if(i < newListData.length){
                vm.update(modelChildren,size,_getOption(i),forceUpdate)  //新增节点没有挂在，删除节点也没有移除
                newVms[i] = vm;
            }else{
                vm.unmount()
            }
        }
        for(; i < newListData.length; i++){
            newVms[i] = new SilentViewModel(_parentEl,modelChildren,size,this.getOption(i))
        }
        this._vms = newVms
        this._listData = newListData;
    }
    mount(){
        const {_vms} = this;
        _vms.forEach((vm)=>{
            vm && vm.mount()
        })
    }
    unmount(){
        const {_vms} = this;
        _vms.forEach((vm)=>{
            vm && vm.unmount()
        })
    }
}


export class ViewModel implements IViewModel{
    children:IViewModelCollection
    iteratorChildren:SilentViewModelCollection
    iteratorEl:HTMLElement
    iteratorSize:{width:number,height:number}
    view:Movable
    _rect:OperationPos
    modelType:ModelType
    private _listData:Array<any>
    _initialParent:IViewModel
    private _prevParent:IViewModel
    private _localData:any
    constructor(public model:BaseModel,private _parent:IViewModel,private _options:ViewModelOptions){
        this._prevParent = _parent
        this.modelType = model.get('type',null);
        this._initialParent = _parent;
        const {localData,isSilent} = this._options
        this._localData = localData
        this.updateListData(model)
        const MovableClass = modelIsArtboard(this.modelType) ? ArtBoardMovable : Movable
        this.updateIteratorSize(model);
        const upOpt = this.getMovableUpdateOpt()
        this.view = new MovableClass(baseModel2Model(model),Object.assign({},_options || {},{
            modelType:this.modelType,
            isOperating:_options.isOperating,
            getScale:_options.getScale,
            vm:this,
            getLocalData:this.getLocalData,
            isChild:_parent != null && !modelIsRoot(_parent.modelType) && !modelIsArtboard(_parent.modelType),
            excute:this.excute.bind(this),
            ...upOpt
        }))
        this.getChildOptions = this.getChildOptions.bind(this);
        const modelChildren = model.get('children',WrapData([]));
        this.initChildren(modelChildren);
        _parent && _parent.appendChild(this)
        this.view.mount();
        this.updateSilenChildren(modelChildren)
        !isSilent && this._options.addViewModel(this);
    }
    getListData(){
        return this._listData;
    }
    initChildren(modelChildren:BaseModel){
        // const {_listData,iteratorSize} = this;
        // const modelChildren = model.get('children',WrapData([]));
        this.children = createViewModels(this,modelChildren,this.getChildOptions());
        // if(_listData && _listData.length > 1){
        //     this.iteratorChildren = new SilentViewModelCollection(
        //         this.view.view.getRoot(),
        //         this.getChildOptions,
        //         {
        //             size:iteratorSize,
        //             listData:_listData,
        //             modelChildren
        //         }
        //     )
        // }
    }
    updateSilenChildren(modelChildren:BaseModel){
        const {_listData,iteratorSize} = this;
        if(_listData){
            if(this.iteratorChildren) return;
            this.iteratorChildren = new SilentViewModelCollection(
                this.view.view.getRoot(),
                this.getChildOptions,
                {
                    size:iteratorSize,
                    listData:_listData,
                    modelChildren
                }
            )
            this.iteratorChildren.mount();
        }else{
            if(this.iteratorChildren){
                this.iteratorChildren.unmount()
                this.iteratorChildren = null
            }
        }
    }
    getLocalData=()=>{
        return this._localData
    }
    updateLocalData(val:any){
        this._localData = val;
    }
    getScopeValue(){
        const {renderEngine} = this._options
        return Object.assign({},renderEngine.getData(),this._localData)
    }
    getNewLocalData(index:number=0){
        const {_listData,_localData} = this;
        const newLocalData = _listData ? _listData[index] : null;
        if(newLocalData || _localData){
            return Object.assign({},_localData || {},newLocalData || {})
        }
    }
    getChildOptions(index:number=0){
        const {model} = this;
        let childOption = this._options;
        const result = Object.assign({},childOption);
        if(modelIsArtboard(this.modelType)){
            result.artboardId = model.get('id',null)
        }
        const newLocalData = this.getNewLocalData(index)
        if(newLocalData){
            result.localData = newLocalData
        }
        return result
    }
    getPrevParent(){
        return this._prevParent
    }
    resetPrevParent(){
        this._prevParent = this._parent
        this._parent.mark(false)
    }
    updateIteratorSize(model:BaseModel){
        const {_listData} = this;
        this.iteratorSize = _listData ? getWrapSize(model) : null
    }
    getMovableUpdateOpt(){
        const {_listData,iteratorSize} = this;
        const isIterator = !!_listData
        return {
            isIterator,
            iteratorSize
        }
    }
    changeParent(parent:IViewModel,artboardId:string){
        const {onModelStructureChange} = this._options
        this.changeArtboardId(artboardId);
        if(parent == null) return;
        if( parent.children == null ){
            parent.children = ViewModelCollection.createEmptyViewModelCollection(parent,parent.getChildOptions())
        }
        this._prevParent = this._parent
        this._parent = parent;
        this._prevParent.mark(false);
        parent.mark(true)


        this.updateLocalData(parent.getNewLocalData());  //因为来到了新的父容器，本地变量发送了改变，需要出发重新渲染
        this.view.update(baseModel2Model(this.model),this.getMovableUpdateOpt());


        parent.children.appendViewModel(this);
        this.view.updatePosAndSize(this.getRelativeRect(this._rect)) //当更改父容器的时候需要还原到新父容器下的相对坐标
        parent.appendChild(this);
        this.view.updateIsChild(
            parent != null && !modelIsRoot(parent.modelType) && !modelIsArtboard(parent.modelType)
        )
        onModelStructureChange && onModelStructureChange()
    }
    mark(flag:boolean){
        this.view.mark(flag)
    }
    didMount(){
        this.children && this.children.didMount();
        this.onDidMount();
    }
    getRootEl(){
        return this.view.el
    }
    appendChild(viewModel:ViewModel){
        this.view.appendChild(viewModel.getRootEl());
    }
    getView(){
        return this.view;
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
    separate(){
        if(this._parent == null) return;
        this.view.separate(this._parent.getView());
    }
    excute(type:number,data:any[]){
        this._options.commander.excute(type,{
            data:data,
            vm:this
        }); 
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
    recalculateRect(){ //更新当前viewModel 是相对画布的坐标 todo 当isGroup的时候需要动态更新
        const {getRect} = this._options
        // const scale = getScale();
        const pos = getRect();
        const cur = this.view.getBoundingClientRect();
        this._rect = new OperationPos((cur.left - pos.left),(cur.top - pos.top),(cur.width),(cur.height),(rect)=>{
            this.view.updatePosAndSize(this.getRelativeRect(rect)) //当更新的时候需要还原到父容器下的相对坐标
        })
    }
    updateRect(pos:IPos){
        this._rect.changeValue(pos)
    }
    changeRect(target:string,diffx:number,diffy:number,onlyPos:boolean=false){
        const {modelType,children,_parent} = this;
        _parent.mark(true);
        //@ts-ignore
        this._rect[target](diffx,diffy,onlyPos);
        if(modelType !== ModelType.isArtBoard && children){
            this.children.viewModelList.forEach((child)=>{
                ViewModel.changeRectByPercent(`${target}Percent`,child,this._rect,onlyPos)
            })
        }
    }
    // setRect(rect:OperationPos){
    //     this._rect = rect;
    // }
    static changeRectByPercent(target:string,vm:IViewModel,rootPos:OperationPos,onlyPos:boolean=false):void{
        const vmRect = vm.getRect();
        const parentPos = vm.getParentRect();
        // const pos = vm.getRelativeRect(vmRect,parentPos);
        // const curWidth = vmRect.width,curHeight = vmRect.height;
        //@ts-ignore
        // vmRect[target](parentPos,diffX,diffY)
        vmRect[target](parentPos,rootPos,onlyPos)
        //需要重新计算 
        // const childHPercent = fixPercent(newRect.width / vmRect.width),childVPercent = fixPercent(newRect.height / vmRect.height);
        vm.children.size && vm.children.viewModelList.forEach((child)=>{
            ViewModel.changeRectByPercent(target,child,rootPos,onlyPos);
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
    static getContainFrame(vm:IViewModel,rect:OperationPos,filterVm:IViewModel):IViewModel{
        if(vm === filterVm) return;
        if(vm.children.size){
            const childVms = vm.children.viewModelList;
            for(let i = childVms.length - 1; i >= 0; i--){
                const childVm = childVms[i];
                const overLapVm = ViewModel.getContainFrame(childVm,rect,filterVm);
                if(overLapVm) return overLapVm
            }
        }
        if(vm.modelType === ModelType.isFrame){
            const isOverLap = vm.getRect().isOverlap(rect);
            if(isOverLap){
                return vm;
            }
        }
    }
    getArtboardId(){
        return this._options.artboardId
    }
    changePosition(diffx:number,diffy:number,onlyPos:boolean=false):boolean{ //todo 由于在实际拖动以及最终释放之后是分别计算转换逻辑的，需要确保最终行为一致性
        const {artboardId,getViewModel,getArtboards,getRootViewModel} = this._options
        this._rect.changeLeftAndTop(diffx,diffy,onlyPos);
        if(modelIsArtboard(this.modelType) || onlyPos) return; //如果是画板就不需要走下面的逻辑
        const parentVm = this._parent;
        if(artboardId != null){
            const artboard = getViewModel(artboardId);
            if(artboard == null) return
            const isOverlap = artboard.getRect().isOverlap(this._rect)
            if(!isOverlap){ //移动到顶层
                parentVm.removeChildViewModel(this);
                this.changeParent(getRootViewModel(),null);
                return true;
                //todo 添加到顶层
            }
            const ovm = ViewModel.getContainFrame(getRootViewModel(),this._rect,this)
            if(ovm){
                if(ovm !== parentVm){
                    // console.log('go here');
                    parentVm.removeChildViewModel(this);
                    this.changeParent(ovm,artboardId);
                    return true;
                }else{
                    parentVm.mark(true);
                }
            }else{
                if(parentVm && parentVm.modelType === ModelType.isFrame){
                    const pparentVm = parentVm.getParent();
                    // console.log('pparentVm :',pparentVm);
                    if(pparentVm){
                        parentVm.removeChildViewModel(this);
                        this.changeParent(pparentVm,artboardId)
                        return true;
                    }
                }else{  //在当前画布内移动
                    parentVm.mark(true);
                }
            }
            // return false; 当前viewModel移出了当前所属的artboard
        }
        const allArtboards = getArtboards({[artboardId]:true});
        const overlapArtboard = getOverlapArtboard(allArtboards,this._rect);
        if(overlapArtboard){ //移入新的画布
            this._parent.removeChildViewModel(this);
            this.changeParent(overlapArtboard,overlapArtboard.getModel().get('id',null));
            return true
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
            this.recalculateRect();
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
    getRelativeRect(rect:IPos,parentRect?:OperationPos){
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
        const {isSilent} = this._options
        if(isSilent) return
        this.view.onDidUpdate();
        this.children && this.children.didUpdate();
        // console.log(`【${this.model.get('id',null)}】updated!`);
        this.recalculateRect();
        // this._rect = this.view.getRect();
    }
    onDidMount(){
        const {isSilent} = this._options
        if(isSilent) return
        this.view.onDidMount();
        // console.log(`【${this.model.get('id',null)}】mounted!`);
        this.recalculateRect();
        // ViewModel.updateChildrenPosAndSize(this);
    }
    remove(){  //销毁
        const {isSilent} = this._options
        this.children.remove();
        if(this._parent == null) return;
        this.view.removeFrom(this._parent.getView());
        !isSilent && this._options.removeViewModel(this);
    }
    getModel(){
        return this.model;
    }
    updateListData(model:BaseModel){
        const {renderEngine} = this._options
        if(renderEngine){
            const result = renderEngine.getListData(model,this.getScopeValue())
            if(result != null){
                if(Object.prototype.toString.call(result) === "[object Array]"){
                    this._listData = result
                }else{
                    this._listData = []
                }
                return;
            }
        }
        this._listData = null;
    }
    update(model:BaseModel,forceUpdate?:boolean){
        this._initialParent = this._parent;
        if(model == null) {
            this.remove();
            return;
        };
        const {isSilent} = this._options
        const modelChildren = model.get('children',WrapData([]));
        const prevModel = this.model;
        const prevId = prevModel.get('id',null)
        const curId = model.get('id',null)
        const idNotEqual = prevId !== curId
        const needUpdate = forceUpdate || idNotEqual || !isEqual(model,prevModel)
        this.updateListData(model)
        this.updateIteratorSize(model);
        if(needUpdate){
            // this.view.update(model.searialize());
            this.view.update(baseModel2Model(model),this.getMovableUpdateOpt());
        }
        this.model = model;
        if(idNotEqual && !isSilent){
            this._options.updateViewModel(prevId,this);
        }
        this.modelType = model.get('type',false)
        this.view.setModelType(this.modelType);
        if(this.children){
            this.children.updateLocalData(this.getNewLocalData());
            this.children.update(modelChildren,forceUpdate);
        }else if(modelChildren && modelChildren.size > 0){
            this.children = createViewModels(this,modelChildren,this.getChildOptions());
        }
        
        this.updateSilenChildren(modelChildren)
        if(this.iteratorChildren){
            this.iteratorChildren.update({
                size:this.iteratorSize,
                listData:this._listData,
                modelChildren:modelChildren
            },forceUpdate)
        }
        if(needUpdate){
            this.onDidUpdate();
        }
    }
}



function createViewModels(parent:IViewModel,models:BaseModel,_options:ViewModelOptions):ViewModelCollection{
    // if(models == null) return;
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

