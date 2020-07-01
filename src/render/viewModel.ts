
// import {ViewAttribute} from './type';
import {Model} from './model';
import {View,FragmentView} from './view';
import {IView} from './type';

export class ViewModelCollection{
    viewModelList:ViewModel[]
    constructor(private _parent:ViewModel,private _models:Model[]){
        this.viewModelList = _models.map((model)=>{
            const viewModel = new ViewModel(new View(model),_parent)
            return viewModel
        })
    }
    update(newModels:Model[]){
        let index = 0;
        const newModelList = []
        for(;index < this.viewModelList.length; index++){
            const item = this.viewModelList[index];
            const newModel = newModels[index];
            if(newModel){
                item.update(newModel);
                newModelList.push(item);
            }else{
                item.remove();
            }
        }
        this.viewModelList = newModelList;
        for(; index < newModels.length; index++){
            const newModel = newModels[index];
            const newViewModel = new ViewModel(new View(newModel),this._parent);
            this.viewModelList.push(newViewModel);
        }
    }
}


export class ViewModel{
    children:ViewModelCollection
    constructor(public view:IView,private _parent:ViewModel){
        this.children = createViewModel(this,this.getModel().children);
        _parent && _parent.appendChild(this)
    }
    appendChild(viewModel:ViewModel){
        this.view.appendChild(viewModel.view);
    }
    remove(){

    }
    getModel(){
        return this.view.getModel();
    }
    update(model:Model){
        if(model == null) return;
        this.view.update(model);
        if(this.children){
            this.children.update(model.children);
        }
    }
}

export function createViewModel(parent:ViewModel,models:Model[],mountNode?:HTMLElement):ViewModelCollection{
    if(models == null) return;
    let parentViewModel = parent || new ViewModel(new FragmentView(mountNode),null);
    const collection = new ViewModelCollection(parentViewModel,models);
    if(mountNode && parentViewModel.view instanceof FragmentView){
        mountNode.appendChild(parentViewModel.view.getFragmentAndChange());
    }
    return collection;
} 