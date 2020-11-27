import {Model,ModelProps,ObjectStyleDeclaration} from './type';
export interface ViewOptions{
    
}

export interface IView<T>{
    // model:Model
    // appendChild(view:IView<T>):void
    update(model:T):void
    render():void
    // getRect():DOMRect
    getRoot():Node
    getModel():T
    updateStyle(width:number,height:number):void
    destroy():void
} 
export type CreateView = (data:Model,options?:ViewOptions)=>IView<Model>

export class View implements IView<Model>{
    el:HTMLElement
    private _options:ViewOptions
    constructor(private _model:Model,options?:ViewOptions){
        this._options = options
    }
    render(){
        const el = document.createElement(this._model.name);
        this.el = el;
        this.updateAttribute();
    }
    getModel(){
        return this._model;
    }
    updateStyle(width:number,height:number){
        const elStyle = this.el.style
        elStyle.width = `${width}px`
        elStyle.height = `${height}px`
    }
    // updateAttribute(beforePropSchemas:ModelPropSchemas = {},beforeStyle:ObjectStyleDeclaration={}){
    //     const {el ,_model} = this;
    //     const {propSchemas,style} = _model
    //     if(beforePropSchemas){
    //         Object.keys(beforePropSchemas).forEach((key)=>{
    //             if(!propSchemas[key]){
    //                 propSchemas[key] = null
    //             }
    //         })
    //     }
    //     if(beforeStyle){
    //         Object.keys(beforeStyle).forEach((key:any)=>{
    //             if(!style[key]){
    //                 style[key] = ''
    //             }
    //         })
    //     }
    //     propSchemas && Object.keys(propSchemas).forEach((key)=>{
    //         const item = propSchemas[key];
    //         if(key === 'style') return;
    //         if(key === 'children'){
    //             el.innerHTML = item.value;
    //             return;
    //         }
    //         if(item == null){
    //             el.removeAttribute(key);
    //         }else{
    //             el.setAttribute(key,item.value);
    //         }
    //     })
    //     if(style){
    //         Object.keys(style).forEach(styleName => {
    //             //@ts-ignore
    //             el.style[styleName] = style[styleName];
    //         });
    //     }
    // }
    updateAttribute(beforeProps:ModelProps={},beforeStyle:{value:ObjectStyleDeclaration}={value:{}}){
        const {el ,_model} = this;
        const {props} = _model
        const style = (props.style || {}).value
        if(beforeProps){
            Object.keys(beforeProps).forEach((key)=>{
                if(!props[key]){
                    props[key] = null
                }
            })
        }
        if(beforeStyle && beforeStyle.value){
            Object.keys(beforeStyle.value).forEach((key:any)=>{
                if(!style[key]){
                    style[key] = null
                }
            })
        }
        props && Object.keys(props).forEach((key)=>{
            const item = props[key];
            if(key === 'style') return;
            if(key === 'children'){
                el.innerHTML = item.value;
                return;
            }
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
    // appendChild(view:IView<Model>){
    //     if(view == null) return;
    //     this.el.appendChild(view.getRoot());
    // }

    update(model:Model){
        const {props} = this._model;
        this._model = model
        this.updateAttribute(props,props.style);
    }
    destroy(){

    }
}