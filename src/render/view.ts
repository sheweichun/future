import {BaseModel} from '../render/index'
import {Model} from './model';
import {Movable} from './movable';
import {IView,ViewOptions,ViewLifeCallback} from './type'; 
import { completeOptions } from '../utils';


const DEFAULT_OPTIONS = {

}


export class FragmentView implements IView<BaseModel>{
    rootEl:Node = document.createDocumentFragment()
    constructor(private _model:BaseModel,private _el:HTMLElement){}
    appendChild(view:IView<BaseModel>){
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
export class View implements IView<BaseModel>{
    el:HTMLElement
    topEl:Movable
    private _model:Model
    private _options:ViewOptions
    constructor(private _baseModel:BaseModel,options?:ViewOptions){
        this._options = completeOptions(options,DEFAULT_OPTIONS);
        //@ts-ignore
        this._model = _baseModel.toJS() as Model;
        const {_model} = this;
        const el = document.createElement(_model.name);
        this.el = el;
        this.topEl = new Movable(el,this._model,{
            onPostionChange:this._options.onPostionChange
        });
        this.updateAttribute();
    }
    getBoundingClientRect(){
        return this.topEl.getBoundingClientRect();
    }
    getRect(){return this.getRoot().getBoundingClientRect()}
    getModel(){
        return this._baseModel;
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
        return this.topEl.el;
    }
    appendChild(view:IView<BaseModel>){
        if(view == null) return;
        this.el.appendChild(view.getRoot());
    }
    update(model:BaseModel){
        this._baseModel = model;
        //@ts-ignore
        const jsModel = model.toJS() as Model;
        this._model = jsModel
        this.updateAttribute();
        this.topEl.update(jsModel);
        // const {position} = jsModel.extra;
        // if(position){
        //     const {left,top} = position
        //     this.topEl.updatePosition(left,top);
        // }
        const {didUpdate} = this._options
        didUpdate && didUpdate();
    }
    destroy(){

    }
}



export function createView(model:BaseModel){
    return new View(model);
}