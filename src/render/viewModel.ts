
// import {ViewAttribute} from './type';
import {BaseModel,WrapData,isEqual} from '../render/index'
import {Model} from './model';
import {Movable} from './movable';
import {IViewModel,ViewModelOptions} from './type'

export class ViewModelCollection{
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
        }
        this._models = newModels;
    }
}


export class ViewModel implements IViewModel{
    children:ViewModelCollection
    view:Movable
    _rect:DOMRect
    constructor(public model:BaseModel,private _parent:ViewModel,private _options:ViewModelOptions){
        this.view = new Movable(model.searialize() as Model,Object.assign({},_options || {},{
            isRoot:model.get('isRoot',false),
            excute:this.excute.bind(this),
            // onFocus:this.onFocus.bind(this),
            // onBlur:this.onBlur.bind(this),
            // onPostionChange:this.onPostionChange.bind(this),
            didUpdate:this.onDidUpdate,
            didMount:this.onDidMount
        }))
        //@ts-ignore
        this.children = createViewModels(this,this.getModel().get('children'),this._options);
        _parent && _parent.appendChild(this)
    }
    appendChild(viewModel:ViewModel){
        this.view.appendChild(viewModel.view);
    }
    excute(type:number,data:any[]){
        this._options.commander.excute(type,this,data);
    }
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
    onDidUpdate(){
        console.log('update');
        // this._rect = this.view.getRect();
    }
    onDidMount(){

    }
    remove(){
        if(this._parent == null) return;
        this._parent.view.removeChild(this.view);
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
        if(!isEqual(model,prevModel)){
            this.view.update(model.searialize());
        }
        this.model = model;
        const modelChildren = model.get('children',WrapData([]));
        if(this.children){
            this.children.update(modelChildren);
        }else if(modelChildren && modelChildren.size > 0){
            this.children = createViewModels(this,modelChildren,this._options);
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

