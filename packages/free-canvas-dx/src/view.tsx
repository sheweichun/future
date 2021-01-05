
import {View,ModelProps,ObjectStyleDeclaration,Model,ViewOptions} from 'free-canvas-shared'
import {getDxValueFromModelAttr,DxViewOpt} from './util'


// interface NormalViewOpt extends ViewOptions{
//     data?:any
// }


const BLACKLIST_MAP:{[key:string]:boolean} = {
    listData:true
}


export class NormalView extends View{
    private getData:()=>any
    constructor(_model:Model,options:DxViewOpt){
        super(_model,options)
        this.getData = options.getData
    }
    updateAttribute(beforeProps:ModelProps={},beforeStyle:{value:ObjectStyleDeclaration}={value:{}}){
        const {el ,_model,getData} = this;
        const newData = getData();
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
            if(BLACKLIST_MAP[key]) return;
            const item = props[key];
            if(key === 'style') return;
            if(key === 'children'){
                el.innerHTML = item.value;
                return;
            }
            if(item == null || (!item.value && !item.expression)  || item.disabled){
                el.removeAttribute(key);
            }else{
                el.setAttribute(key,getDxValueFromModelAttr(item,newData));
            }
        })
        if(style){
            Object.keys(style).forEach(styleName => {
                const styleItem = style[styleName]
                //@ts-ignore
                el.style[styleName] = getDxValueFromModelAttr(styleItem,newData);
            });
        }
    }
}