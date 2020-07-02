
// import {ViewAttribute} from './type';
import {BaseModel,WrapData,isEqual} from '../render/index'
import {Model} from './model';
import {View,FragmentView} from './view';
import {IView} from './type';

export class ViewModelCollection{
    viewModelList:ViewModel[]
    constructor(private _parent:ViewModel,private _models:BaseModel){
        
        const viewModels:any[] = []
        //@ts-ignore
        _models.forEach((model)=>{
            const viewModel = new ViewModel(model,_parent)
            viewModels.push(viewModel);
        })
        this.viewModelList = viewModels;
    }
    update(newModels:BaseModel){
        if(isEqual(newModels,this._models)) return;
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
            const newViewModel = new ViewModel(newModel,this._parent);
            this.viewModelList.push(newViewModel);
        }
        this._models = newModels;
    }
}


export class ViewModel{
    children:ViewModelCollection
    view:IView<BaseModel>
    constructor(model:BaseModel,private _parent:ViewModel,mountNode?:HTMLElement){
        
        if(model.get('isRoot',false)){
            this.view = new FragmentView(model,mountNode);
            mountNode.appendChild((this.view as FragmentView).getFragmentAndChange());
        }else{
            this.view = new View(model,{
                onPostionChange:this.onPostionChange.bind(this)
            })
        }
        //@ts-ignore
        this.children = createViewModels(this,this.getModel().get('children'));
        _parent && _parent.appendChild(this)
    }
    appendChild(viewModel:ViewModel){
        this.view.appendChild(viewModel.view);
    }
    onPostionChange(left:number,top:number){
        const model = this.view.getModel();
        model.set('extra',WrapData({
            left,
            top
        }))
    }
    remove(){
        if(this._parent == null) return;
        this._parent.view.getRoot().removeChild(this.view.getRoot());
    }
    getModel(){
        return this.view.getModel();
    }
    update(model:BaseModel){
        if(model == null) return;
        const prevModel = this.view.getModel();
        if(model.get('id') === '1112'){
            console.log(prevModel.toJS(),model.toJS(),isEqual(model,prevModel))
        }
        if(!isEqual(model,prevModel)){
            //@ts-ignore
            if(!prevModel.get('isRoot')){
                this.view.update(model);
            }
        }
        if(this.children){
            //@ts-ignore
            this.children.update(model.get('children'));
        }
    }
}

function createViewModels(parent:ViewModel,models:BaseModel):ViewModelCollection{
    if(models == null) return;
    // let parentViewModel = parent || new ViewModel(new FragmentView(mountNode),null);
    const collection = new ViewModelCollection(parent,models);
    // if(mountNode && parentViewModel.view instanceof FragmentView){
    //     mountNode.appendChild(parentViewModel.view.getFragmentAndChange());
    // }
    return collection;
} 

export function createViewModel(parent:ViewModel,model:BaseModel,mountNode?:HTMLElement){
    if(model == null) return;
    // let viewModel;
    // if(model.get('isRoot',false)){
    //     viewModel = new ViewModel(new FragmentView(model,mountNode),null);
    //     mountNode.appendChild((viewModel.view as FragmentView).getFragmentAndChange());
    // }else{
    //     viewModel = new ViewModel(new View(model),parent);
    // }
    const viewModel = new ViewModel(model,parent,mountNode);
    return viewModel;
}

