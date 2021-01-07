
import {Model,ModelType,ModelPos,ModelPosKeys,ModelAttrValue, ModelProps} from '@pkg/free-canvas-shared';
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
    return function transformStyleUnit(val:ModelAttrValue,ret:Model){
        const value = val.value.replace('ap',unit)
        //@ts-ignore
        ret.props.style.value[name] = Object.assign({},val,{
            value
        })
    }
}

function createPositionUnitTransform(name:string){
    return function transformStyleUnit(val:ModelAttrValue,ret:Model){
        const value = parseInt(val.value)
        //@ts-ignore
        ret.extra.position[name] = value
    }
}

function createStyleTransform(name:string){
    return function transformStyleUnit(val:ModelAttrValue,ret:Model){
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


const NAME_MAP:{[key:string]:boolean} = {
    listData:true
}

function transformValue(val:string,name:string):ModelAttrValue{
    if(val == null) return {value:val}
    if(val.indexOf('@') === 0){
        return {
            value:null,
            expression:val,
            isExp:true,
            onlyExp:NAME_MAP[name]
        }
    }
    return {
        value:val
    }
}

function attributes2Obj(attrs:NamedNodeMap,model:Model){
    const ret:{[key:string]:any} = {};
    for(let i = 0 ;i < attrs.length; i++){
        const item:Attr = attrs.item(i);
        if(POSTION_NAME_MAP[item.name as POSTION_NAME]){
            attributeTransformMap[item.name as attributeTransformMapKeys](
                transformValue(item.value,item.name),
                model
            )
        }else{
            ret[item.name] = transformValue(item.value,item.name)
        }
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
   
    if(tagName === 'FrameLayout'){
        const attributes = el.attributes;
        for(let i = 0; i < attributes.length; i++){
            const item:Attr = attributes.item(i)
            // console.log('name :',item.name);
            //@ts-ignore
            const transformer = attributeTransformMap[item.name]
            if(transformer){
                transformer(transformValue(item.value,item.name),model);
            }else{
                model.props[item.name] = transformValue(item.value,item.name)
            }
        }
        model.name = 'div'
        model.protoId = 'div'
        model.type = ModelType.isFrame
    }else{
        model.name = DX_TEMPLATE
        model.props.dxSource = {
            value:{
                name:tagName,
                attrs:attributes2Obj(el.attributes,model)
            }
        }
        model.protoId = tagName
    }
    if(modelType != null){
        model.type = modelType
        if(modelType === ModelType.isArtBoard){
            const style = model.props.style.value
            style.backgroundColor = {value:'#ffffff'}
            style.overflow = {value:'hidden'}
            style.position = {value:'relative'}
        }
    }
    if(el.children){
        for(let i = 0; i < el.children.length; i++){
            const child = el.children[i]
            model.children.push(transform2Model(child,null))
        }
    }
    return model
}


export function template2Model(data:string,title:string):Model{
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
    const arboard = transform2Model(doc.children[0],ModelType.isArtBoard)
    arboard.displayName = title;
    // arboard.extra.label = title;
    model.children.push(arboard)
    // console.log('arboard :',JSON.stringify(arboard,null,'  '));
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
        const item = style[name]
        let val:string
        if(item != null && !item.isExp && item.value){
            item.value = item.value.replace(/px$/,'ap');
        }
        const newName = reverseAttributeTransformMap[name] || name
        //@ts-ignore
        ret[newName] = item
        return ret;
    },{})
}

function filterArboardProps(props:ModelProps){
    if(props == null) return {}
    return Object.keys(props).reduce((ret,name)=>{
        const item = props[name]
        if(item){
            const newName = reverseAttributeTransformMap[name] || name
            //@ts-ignore
            ret[newName] = item
        }
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
        const posVal = pos[name];
        if(posVal === 0){
            ret[newName] = {
                value:pos[name] + ''
            }
        }else{
            ret[newName] = {
                value:pos[name] + 'ap'
            }
        }
        return ret;
    },{} as DXDSLAttribute)
}



export interface DXDSLAttribute{
    [key:string]:ModelAttrValue
}


function attributes2Str(attrs:DXDSLAttribute){
    if(attrs == null) return ''
    const result:Array<string> = []
    Object.keys(attrs).forEach((name)=>{
        const item = attrs[name];
        // console.log('item :',item);
        let itemValue = '';
        if(item){
            const {isExp,expression,value} = item;
            itemValue = (isExp ? expression : value) || ''
        }
        if(itemValue){
            result.push(`${name}="${itemValue}"`)
        }
    })
    return result.join(' ')
}

export function model2Template(md:Model):string{
    const {type,children,extra,name,props={}} = md
    if(type === ModelType.isRoot){
        return children.map((item)=>{
            return model2Template(item)
        }).join('')
    }
    const {style,...otherProps} = props;
    let tagName:string = name;
    let attributes:DXDSLAttribute = {} 
    if(name === 'div'){
        tagName = 'FrameLayout'
        const pos = Object.assign({},extra && extra.position);
        if(type === ModelType.isArtBoard){
            pos.left = 0;
            pos.top = 0;
        }
        const otherAttr = filterArboardProps(otherProps);
        attributes = Object.assign({},otherAttr,filterArboardStyle(style && style.value),postion2Attribute(pos))
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