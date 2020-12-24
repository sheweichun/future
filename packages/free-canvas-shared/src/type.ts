
// import { ImgCookDsl } from './imgcook'
// import {Model} from './model'
// export interface Market{
    
// }


  
// export interface IMutation{
//     onModelSelected(target:any,data:{needKeep:boolean,x:number,y:number,noTrigger?:boolean}):void
// }

export type CommanderCallback = (data?:any)=>void


export interface CommanderOption {
    callback:CommanderCallback,
    context?:any,
    params?:any[]
}


export interface ICommander{
    register(name:number,callback: CommanderCallback,context?:any,params?:any[]):void
    unregister(name:number):void
    excute(name:number,data?:any):any
    clear():void
}
export enum CanvasEvent {
    MOUSEWHEEL="mousewheel",
    RESIZE="resize",
    CLICK="click",
    DBCLICK="dblclick",
    MOUSEDOWN="mousedown",
    MOUSEMOVE="mousemove",
    MOUSEENTER="mouseenter",
    MOUSELEAVE="mouseleave",
    MOUSEUP="mouseup",
    FOUCS="focus",
    BLUR="blur",
    KEYDOWN="keydown",
    KEYUP="keyup",
    DRAGSTART="dragstart",
    DRAGOVER="dragover",
    DRAGENTER="dragenter",
    DRAGLEAVE="dragleave",
    CONTEXTMENU="contextmenu"
}

export enum COMMANDERS { 
    POSITIONCHANGE,
    SELECTED,
    UNSELECTED,
    ADD,
    SELECTSTART, //物料拖动开始
    SELECTMOVE, //物料拖动
    SELECTSTOP, //物料拖动结束
    SELECTENTER, //物料进入画布区域
    SELECTLEAVE, //物料离开画布区域
    FOCUSCANVAS,
}




export interface UniversalObject{
    [name:string]:any
}

export type ObjectStyleDeclaration = Partial<CSSStyleDeclaration>


// export enum ModelFromType {
//     ISDEFAULT,
//     INDEFAULT,
//     ITEM
// }

// export type DSLModel = (Model | ImgCookDsl)[]

// export interface DSL{
//     data:DSLModel
//     type:DSLType
// }

// export enum DSLType{
//     MODEL,
//     IMGCOOK
// }

// export enum ModelType{
//     isRoot,
//     isGroup,
//     isArtBoard,
//     isFrame
// }

// export function modelIsGroup(type:ModelType){
//     return type === ModelType.isGroup
// }

// export function modelIsRoot(type:ModelType){
//     return type === ModelType.isRoot
// }

// export function modelIsArtboard(type:ModelType){
//     return type === ModelType.isArtBoard
// }


// export enum ModelPropComponentType{
//     backgroundColor,
//     text,
//     xywh,
//     select,
//     switch
// }

// export interface ModelPropSchema{
//     type:ModelPropComponentType,
//     identity?:string,
//     title?:string
//     key:string
//     sortIndex:number
//     props?:{[key:string]:any}
//     get?:(val:Model)=>any
//     update?:(mutation:IMutation,target:any)=>void
// }

// export interface ModelPropSchemaMap{
//     [key:string]:ModelPropSchema[]
// }


// export type RenderVarInput = (data:Model[],schema:ModelPropSchema,mut:IMutation)=>JSX.Element 


// export interface ModelPropSchemas{
//     [key:string]:ModelPropSchema
// }
/*
*  style中的backgroundColor可能是个object 需要特殊处理
*/


// export type AttrPropType = {
//     modelData:Model[]
//     renderVarInput:RenderVarInput
//     schema:ModelPropSchema
//     selectModel:Model
//     mutation:IMutation
// }

// export type AttrStateType = {
//     value:ModelAttrValue
// }

// export interface ModelAttrValue{
//     value:any,
//     expression?:string
//     isExp?:boolean
//     disabled?:boolean
// }

// export interface ModelProps{
//     [key:string]:ModelAttrValue
// }

// export interface ModelAttrProto{
//     type:ModelPropComponentType,
//     title:string,
//     key:string
//     sortIndex:number,
//     props:{
//         [key:string]:any
//     },
//     get?(model:Model):void,
//     update?(mutation:IMutation,data:any):void
// }


// export interface ModelPos{
//     left?:number,
//     top?:number,
//     width?:number,
//     height?:number
// }

// export type ModelPosKeys = keyof ModelPos

// export interface Model {
//     id?:string
//     pid?:string
//     protoId?:string
//     name?:string
//     displayName?:string
//     type?:ModelType
//     props:ModelProps
//     children?:Model[]
//     proto?:{
//         import?:{
//             from :string,
//             version:string,
//             type:ModelFromType
//         },
//         attrs?:ModelAttrProto[]
//     }
//     extra:{
//         label?:string,
//         position?:ModelPos,
//         isSelect?:boolean
//     }
// }


// function getValFromBaseModel(key:string,data:ImutBase){
//     return data.get(key,null);
// }

// function getJSValFromBaseModel(key:string,data:ImutBase,defaultValue?:any){
//     const result = data.get(key,defaultValue)
//     if(result == null) return result;
//     return result.toJS()
// }

// export function baseModel2Model(data:ImutBase){
//     const ret = {
//         id:getValFromBaseModel('id',data),
//         name:getValFromBaseModel('name',data),
//         displayName:getValFromBaseModel('displayName',data),
//         // isRoot:getValFromBaseModel('isRoot',data),
//         // isGroup:getValFromBaseModel('isGroup',data),
//         type:getValFromBaseModel('type',data),
//         style:getJSValFromBaseModel('style',data),
//         props:getJSValFromBaseModel('props',data),
//         extra:getJSValFromBaseModel('extra',data)
//     }
//     return ret;
// }

// export interface IRender{
//     renderByDsl:(data:Model)=>void
// }






export interface MarketDataItemEvent{
    name:string,
    desc:string,
    version?:string
}

export interface MarketDataItem{
    id?:string
    codeTemplate?:any
    protoId?:string
    demo?:string
    doc?:string
    proto?:any
    eventList?:MarketDataItemEvent[]
    name:string,
    displayName?:string
    preview:string
}

export interface MarketData{
    name:string,
    children:{
        name:string,
        children:MarketDataItem[]
    }[]
}

export type ComponentMarketStore = {
    data:MarketData[]
    list:MarketDataItem[]
}

export type ModelVo = {
    [key:string]:any
}


