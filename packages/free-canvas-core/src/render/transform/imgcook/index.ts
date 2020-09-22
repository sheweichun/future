
import {Model,ModelType,ModelProps,ImgCookDsl,ImgCookNodeType, ImgCookItem} from 'free-canvas-shared'

let curId = 1;


function nextId(){
    return (++curId) + ''
}

export function transformImgCookDsl(data:ImgCookDsl){
    const {props,children} = data;
    const {style,attrs} = props;
    return {
        id:nextId(),
        name:'div',
        type:ModelType.isArtBoard,
        extra:{
            position:{
                left:scale(attrs.x),
                top:scale(attrs.y),
                width:scale(parseInt(style.width)),
                height:scale(parseInt(style.height))
            }
        },
        props:{
            style:{
                value:data.props.style
            },
        },
        children:children ? children.map((child)=>{
            return transformImgCookItem(child)
        }) : []
    }

}

const filterKeyMap:{[key:string]:boolean} = {
    lineHeight:true,
    fontSize:true,
    borderRadius:true,
    borderWidth:true,
    borderBottomLeftRadius:true,
    borderBottomRightRadius:true,
    borderTopLeftRadius:true,
    borderTopRightRadius:true,
}

function scale(val:number,ratio=2){
    return Math.ceil(val / ratio)
}

function fixStyle(style:CSSStyleDeclaration){
    Object.keys(style).forEach((key:string)=>{
        if(filterKeyMap[key]){
            //@ts-ignore
            style[key] = (scale(parseInt(style[key])))+'px'
        }
    })
    return style
}


function transformImgCookItem(data:ImgCookItem):Model{
    const {props,children,type} = data;
    const {style,attrs} = props;
    let name:string;
    let propsVal:ModelProps = {};
    switch(type){
        case ImgCookNodeType.BLOCK:
        case ImgCookNodeType.SHAPE:
            name = 'div'
            break;
        case ImgCookNodeType.IMAGE:
            name = 'img'
            propsVal.src = {
                value:attrs.source
            }
            break;
        case ImgCookNodeType.TEXT:
            name = 'span'
            propsVal.children = {
                value:attrs.text
            }
            break;
    }
    if(type === ImgCookNodeType.BLOCK || type )
    return {
        id:nextId(),
        name,
        extra:{
            position:{
                left:scale(attrs.x),
                top:scale(attrs.y),
                width:scale(parseInt(style.width)),
                height:scale(parseInt(style.height))
            }
        },
        props:{
            ...propsVal,
            style:{
                value:fixStyle(style)
            },
        },
        children:children ? children.map((child)=>{
            return transformImgCookItem(child)
        }) : []
    }
}