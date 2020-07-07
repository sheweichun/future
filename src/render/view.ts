// import {Model} from '../render/index'
import {Model} from './model';
import {Movable} from './movable';
import {IView,ViewOptions,ViewLifeCallback} from './type'; 
import { completeOptions } from '../utils';


const DEFAULT_OPTIONS = {

}


export class FragmentView implements IView<Model>{
    rootEl:Node = document.createDocumentFragment()
    constructor(private _model:Model,private _el:HTMLElement){}
    appendChild(view:IView<Model>){
        this.rootEl.appendChild(view.getRoot());
    }
    getModel(){
        return this._model
    }
    getRect(){return this.getRoot().getBoundingClientRect()}
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
export class View implements IView<Model>{
    el:HTMLElement
    private _options:ViewOptions
    constructor(private _model:Model,options?:ViewOptions){
        this._options = completeOptions(options,DEFAULT_OPTIONS);
        const el = document.createElement(_model.name);
        this.el = el;
        this.updateAttribute();
    }
    // getBoundingClientRect(){
    //     return this.el.getBoundingClientRect();
    // }
    getRect(){return this.getRoot().getBoundingClientRect()}
    getModel(){
        return this._model;
    }
    updateAttribute(){
        const {el ,_model} = this;
        const {propSchemas,style} = _model
        propSchemas && propSchemas.forEach((item)=>{
            if(item.name === 'style'){
                return
            }
            el.setAttribute(name,item.value);
        })
        if(style){
            Object.keys(style).forEach(styleName => {
                //@ts-ignore
                el.style[styleName] = style[styleName];
            });
        }
    }
    getRoot(){
        return this.el;
    }
    appendChild(view:IView<Model>){
        if(view == null) return;
        this.el.appendChild(view.getRoot());
    }

    update(model:Model){
        const prevModel = this._model;
        this._model = model
        this.updateAttribute();
        // const {position} = jsModel.extra;
        // if(position){
        //     const {left,top} = position
        //     this.topEl.updatePosition(left,top);
        // }
        const {didUpdate} = this._options
        didUpdate && didUpdate(prevModel,model);
    }
    destroy(){

    }
}



export function createView(model:Model){
    return new View(model);
}