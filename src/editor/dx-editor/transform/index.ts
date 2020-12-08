
import {Model,ModelType,ModelPos,ModelPosKeys} from '@pkg/free-canvas-shared';
import {DX_TEMPLATE} from '../utils/contant'

let curId = 1;


const POSTION_NAME_MAP = {
    width:true,
    height:true,
    marginLeft:true,
    marginTop:true
}

type POSTION_NAME = keyof (typeof POSTION_NAME_MAP)

function nextId(){
    return (++curId) + ''
}

function createStyleUnitTransform(name:string,unit = 'px'){
    return function transformStyleUnit(val:string,ret:Model){
        //@ts-ignore
        ret.props.style.value[name] = val.replace('ap',unit)
    }
}

function createPositionUnitTransform(name:string){
    return function transformStyleUnit(val:string,ret:Model){
        //@ts-ignore
        ret.extra.position[name] = parseInt(val)
    }
}

function createStyleTransform(name:string){
    return function transformStyleUnit(val:string,ret:Model){
        //@ts-ignore
        ret.props.style.value[name] = val
    }
}

const attributeTransformMap = {
    width:createPositionUnitTransform('width'),
    height:createPositionUnitTransform('height'),
    marginLeft:createPositionUnitTransform('left'),
    marginTop:createPositionUnitTransform('top'),
    cornerRadius:createStyleUnitTransform('borderRadius'),
    alpha:createStyleTransform('opacity')
}


const reverseAttributeTransformMap:{[key:string]:string} = {
    borderRadius:'cornerRadius',
    opacity:'alpha'
}

type attributeTransformMapKeys = keyof (typeof attributeTransformMap)


// function transformAttribute(val:string){
//     const items = val.split('=')
// }

// function attributes2Str(attrs:NamedNodeMap){
//     const ret = [];
//     for(let i = 0 ;i < attrs.length; i++){
//         const item:Attr = attrs.item(i);
//         ret.push(`${item.name}="${item.value}"`)
//     }
//     return ret.join(' ')
// }

function attributes2Obj(attrs:NamedNodeMap,model:Model){
    const ret:{[key:string]:string} = {};
    for(let i = 0 ;i < attrs.length; i++){
        const item:Attr = attrs.item(i);
        if(POSTION_NAME_MAP[item.name as POSTION_NAME]){
            attributeTransformMap[item.name as attributeTransformMapKeys](item.value,model)
        }else{
            ret[item.name] = item.value
        }
        // ret.push(`${item.name}="${item.value}"`)
    }
    return ret
}

function transform2Model(el:Element,modelType:ModelType){
    const {tagName} = el;
    const model:Model = {
        extra:{
            position:{
                left:0,
                top:0
            }
        },
        id:nextId(),
        props:{style:{value:{}}},
        children:[]
    }
    if(modelType != null){
        model.type = modelType
        if(modelType === ModelType.isArtBoard){
            const style = model.props.style.value
            style.backgroundColor = '#ffffff'
            style.overflow = 'hidden'
            style.position = 'relative'
        }
    }
    if(tagName === 'FrameLayout'){
        const attributes = el.attributes;
        for(let i = 0; i < attributes.length; i++){
            const item:Attr = attributes.item(i)
            //@ts-ignore
            const transformer = attributeTransformMap[item.name]
            if(transformer){
                transformer(item.value,model);
            }
        }
        model.name = 'div'
    }else{
        model.name = DX_TEMPLATE
        model.props.dxSource = {
            value:{
                name:tagName,
                attrs:attributes2Obj(el.attributes,model)
            }
        }
    }
    model.protoId = tagName
    if(el.children){
        for(let i = 0; i < el.children.length; i++){
            const child = el.children[i]
            model.children.push(transform2Model(child,null))
        }
    }
    return model
}


export function template2Model(data:string):Model{
    const parser = new DOMParser()
    const doc = parser.parseFromString(data,'text/xml');
    // console.dir(doc)
    const model:Model = {
        type:ModelType.isRoot,
        extra:{position:{}},
        id:nextId(),
        props:{style:{value:{}}},
        children:[]
    }
    for(let i = 0; i < doc.children.length; i++){
        const child = doc.children[i];
        model.children.push(
            transform2Model(child,ModelType.isArtBoard)
        )
    }
    return model;
}

const FILTER_KEY_MAP = {
    'overflow':true,
    'position':true
}

const UNIT_REG = /px$/



function filterArboardStyle(style:CSSStyleDeclaration){
    if(style == null) return {}
    return Object.keys(style).reduce((ret,name)=>{
        if(FILTER_KEY_MAP[name as keyof (typeof FILTER_KEY_MAP)] != null){
            return ret;
        }
        //@ts-ignore
        let val:string = style[name]
        if(val != null){
            val = val.replace(/px$/,'ap');
        }
        const newName = reverseAttributeTransformMap[name] || name
        //@ts-ignore
        ret[newName] = val
        return ret;
    },{})
}


const POS_KEY_MAP = {
    left:'marginLeft',
    top:'marginTop',
    width:'width',
    height:'height'
}

function postion2Attribute(pos:ModelPos){
    if(pos == null) return {}
    return Object.keys(pos).reduce((ret,name:ModelPosKeys)=>{
        const newName = POS_KEY_MAP[name] || name;
        ret[newName] = pos[name] + 'ap'
        return ret;
    },{} as DXDSLAttribute)
}



export interface DXDSLAttribute{
    [key:string]:string
}


function attributes2Str(attrs:DXDSLAttribute){
    if(attrs == null) return ''
    return Object.keys(attrs).map((name)=>{
        return `${name}="${attrs[name]}"`;
    }).join(' ')
}

export function model2Template(md:Model):string{
    const {type,children,extra,name,props} = md
    if(type === ModelType.isRoot){
        return children.map((item)=>{
            return model2Template(item)
        }).join('')
    }
    let tagName:string = name;
    let attributes:DXDSLAttribute = {} 
    if(name === 'div'){
        tagName = 'FrameLayout'
        attributes = Object.assign({},filterArboardStyle(props && props.style && props.style.value),postion2Attribute(extra && extra.position))
    }else if(name === DX_TEMPLATE){
        if(props && props.dxSource && props.dxSource.value){
            const dxSourceValue = props.dxSource.value
            tagName = dxSourceValue.name
            attributes = Object.assign({},dxSourceValue.attrs,postion2Attribute(extra && extra.position))
        }
    }
    if(tagName == null){
        if(children){
            return children.map((item)=>{
                return model2Template(item)
            }).join('')
        }
        return ''
    }
    return `<${tagName} ${attributes2Str(attributes)}>
    ${children ? children.map((item)=>{
        return model2Template(item)
    }).join('\n') : ''}
</${tagName}>`
}