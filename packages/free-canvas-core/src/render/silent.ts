import {ImutBase,IRenderEngine,ViewOptions,baseModel2Model,Model,ObjectStyleDeclaration, IView} from 'free-canvas-shared'
import {setStyle} from '../utils/style';
import {completeOptions,fixData} from '../utils/index'
import {createView} from './view'
import {styleSizeColor,MOVABLE_CLASSNAME} from '../utils/constant'
// import {fixData} from '../utils/index'

export interface SilenViewModelOptions extends ViewOptions{
    renderEngine?:IRenderEngine
    localData?:any
}

export class SilentViewModel{
    view:SilentMovable
    private _listData:any
    private _localData:any
    children:SilentViewModelCollection
    constructor(private _parentEl:HTMLElement,private model:ImutBase,private _options:SilenViewModelOptions){
        this.view = new SilentMovable(baseModel2Model(model),_options);
        this.children = new SilentViewModelCollection(this.view.getRootEl(),model.get('children',null),_options)
    }
    getNewLocalData(index:number=0){
        const {_listData,_localData} = this;
        const newLocalData = _listData ? _listData[index] : null;
        if(newLocalData || _localData){
            return Object.assign({},_localData || {},newLocalData || {})
        }
    }
    getChildOptions(index:number=0){
        // const {model} = this;
        let childOption = this._options;
        const result = Object.assign({},childOption);
        const newLocalData = this.getNewLocalData(index)
        if(newLocalData){
            result.localData = newLocalData
        }
        return result
    }
    getModel(){
        return this.model
    }
    // remove(){  //销毁
    //     if(this._parentEl == null) return;
    //     this.children.remove();
    //     this.view.removeFrom(this._parent.getView());
    // }
}


export class SilentViewModelCollection{
    viewModelList:Array<SilentViewModel>
    constructor(private _parentEl:HTMLElement,private _models:ImutBase,private _options:SilenViewModelOptions){
        
        const viewModels:any[] = []
        //@ts-ignore
        _models && _models.forEach((model:ImutBase)=>{
            const viewModel = new SilentViewModel(_parentEl,model,_options)
            viewModels.push(viewModel);
        })
        this.viewModelList = viewModels;
    }
    // update(newModels:ImutBase,forceUpdate?:boolean){
    //     let index = 0;
    //     let modelIndex = 0;
    //     const newModelList = []
    //     for(;index < this.viewModelList.length; index++){
    //         const item = this.viewModelList[index];
    //         //@ts-ignore
    //         const newModel = newModels && newModels.get(modelIndex);
    //         if(newModel){
    //             const prevModel = item.getModel();
    //             if(prevModel.get('id',null) !== newModel.get('id',null)){ //当次数据按照顺序复用原来ID一致的数据，确保顺序一致
    //                 item.remove();
    //                 continue;
    //             }else{
    //                 item.update(newModel,forceUpdate);
    //                 newModelList.push(item);
    //             }
    //         }else{
    //             item.remove();
    //         }
    //         modelIndex++;
    //     }
    //     this.viewModelList = newModelList;
    //     if(newModels){
    //         for(; modelIndex < newModels.size; modelIndex++){
    //             //@ts-ignore
    //             const newModel = newModels.get(modelIndex);
    //             const newViewModel = new ViewModel(newModel,this._parent,this._options);
    //             this.viewModelList.push(newViewModel);
    //             newViewModel.didMount();
    //         }
    //     }
    //     this._models = newModels;
    // }
}

const DEFAULT_OPTIONS = {

}


class SilentMovable{
    protected _options:SilenViewModelOptions;
    style:ObjectStyleDeclaration
    view:IView<Model>
    left:number
    top:number
    width:number
    height:number
    el:HTMLElement
    constructor(protected _data:Model,options:SilenViewModelOptions){
        this._options = completeOptions(options,DEFAULT_OPTIONS);
        this.style = {
            position:'relative'
        }
        const div = document.createElement('div');
        div.id = _data.id;
        div.className = MOVABLE_CLASSNAME
        this.el = div;
        const {renderEngine} = this._options
        const createViewFn = renderEngine ? renderEngine.createView : createView
        this.view = createViewFn(fixData(_data),this._options);
    }
    removeFrom(parent:SilentMovable){
        if(parent == null) return;
        this.view.destroy();
        this.destroy();
        parent.getRootEl().removeChild(this.el);
    }
    destroy(){

    }
    getRootEl(){
        return this.view.getRoot()
    }
    parsePosition(){
        const {position} = this._data.extra
        this.left = position.left || 0;
        this.top = position.top || 0;
        this.width = position.width || 0;
        this.height = position.height || 0;
    }
    setStyle(el?:HTMLElement){
        const {isSelect} = this._data.extra
        
        const target = el || this.el;


        this.style.left = `${this.left}px`;
        this.style.top = `${this.top}px`;

        setStyle(target,this.style);
        if(isSelect){
            target.style.outline = `1px solid ${styleSizeColor}`
        }else{
            target.style.outline = `none`
        }
    }
}