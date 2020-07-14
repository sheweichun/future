// import {Model} from '../render/index'
import {Model,ModelPropSchemas} from './model';
import {ObjectStyleDeclaration} from '../utils/type'
import {Movable} from './movable';
import {IView,ViewOptions} from './type'; 
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
    updateStyle(){}
    // getRect(){return this.getRoot().getBoundingClientRect()}
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
    // getRect(){return this.getRoot().getBoundingClientRect()}
    getModel(){
        return this._model;
    }
    updateStyle(width:number,height:number){
        const elStyle = this.el.style
        elStyle.width = `${width}px`
        elStyle.height = `${height}px`
    }
    updateAttribute(beforePropSchemas:ModelPropSchemas = {},beforeStyle:ObjectStyleDeclaration={}){
        const {el ,_model} = this;
        const {propSchemas,style} = _model
        if(beforePropSchemas){
            Object.keys(beforePropSchemas).forEach((key)=>{
                if(!propSchemas[key]){
                    propSchemas[key] = null
                }
            })
        }
        if(beforeStyle){
            Object.keys(beforeStyle).forEach((key:any)=>{
                if(!style[key]){
                    style[key] = ''
                }
            })
        }
        propSchemas && Object.keys(propSchemas).forEach((key)=>{
            const item = propSchemas[key];
            if(key === 'style') return;
            if(item == null){
                el.removeAttribute(key);
            }else{
                el.setAttribute(key,item.value);
            }
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
        const {propSchemas,style} = this._model;
        this._model = model
        this.updateAttribute(propSchemas,style);
    }
    destroy(){

    }
}



export function createView(model:Model){
    return new View(model);
}