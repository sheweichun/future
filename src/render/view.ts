import {Model} from './model';
import {Moveable} from './movable';
import {IView} from './type'; 



export class FragmentView implements IView{
    rootEl:Node = document.createDocumentFragment()
    constructor(private _el:HTMLElement){}
    appendChild(view:IView){
        this.rootEl.appendChild(view.getRoot());
    }
    getModel(){
        return Model.EmptyModel
    }
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
export class View implements IView{
    el:HTMLElement
    topEl:Moveable
    constructor(private _model:Model){
        const el = document.createElement(_model.tag);
        this.el = el;
        const elStyle = _model.attribute.style || {};
        this.topEl = new Moveable(el,{
            left:elStyle.left,
            top:elStyle.top
        });
        this.initAttribute();
    }
    getBoundingClientRect(){
        return this.topEl.getBoundingClientRect();
    }
    getModel(){
        return this._model;
    }
    initAttribute(){
        const {el ,_model} = this;
        const {attribute} = _model
        Object.keys(attribute).forEach((name)=>{
            if(name === 'style'){
                const styleSheet = attribute[name];
                Object.keys(styleSheet).forEach(styleName => {
                    //@ts-ignore
                    el.style[styleName] = styleSheet[styleName];
                });
                return;
            }
            el.setAttribute(name,attribute[name]);
        })
    }
    getRoot(){
        return this.topEl.el;
    }
    appendChild(view:View){
        if(view == null) return;
        this.el.appendChild(view.getRoot());
    }
    update(model:Model){
        this._model = model;
    }
}



export function createView(model:Model){
    return new View(model);
}