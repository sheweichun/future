// import {Model} from '../render/index'
import {Model} from './model';
// import {ObjectStyleDeclaration} from '../utils/type'
import {IView,View,ViewOptions} from 'free-canvas-shared'
// import {Movable} from './movable';
// import { completeOptions } from '../utils';


const DEFAULT_OPTIONS = {

}


export class FragmentView implements IView<Model>{
    rootEl:Node = document.createDocumentFragment()
    constructor(private _model:Model,private _el:HTMLElement){}
    render(){}
    // appendChild(view:IView<Model>){
    //     this.rootEl.appendChild(view.getRoot());
    // }
    getModel(){
        return this._model
    }
    updateStyle(){}
    destroy(){}
    update(){}
    getFragmentAndChange(){
        const fragment = this.rootEl;
        this.rootEl = this._el;
        return fragment;
    }
    getRoot(){ 
        return this._el
    }
}




export function createView(model:Model,options?:ViewOptions){
    return new View(model,options);
}