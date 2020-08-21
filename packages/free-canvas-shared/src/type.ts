
import {OperationPos} from './pos'
import { ImgCookDsl } from './imgcook'
// export interface Market{
    
// }

export interface ImutBase{ 
    size:number
    _keyPath:string[]
    deref(notSetValue:any):any;
    // Need test of noSetValue
    valueOf(notSetValue:any):any;
  
    get(key:string, notSetValue:any):any 
  
    getIn(keyPath:string[], notSetValue:any):any
  
    set(key:string, value:any):ImutBase
    setIn(keyPath:string[],value:any):ImutBase
    // Needs tests
    remove(key:string):ImutBase
    // Needs tests
    delete(key:string):ImutBase
  
    clear():ImutBase
  
    searialize():any
  
    update(keyOrFn:any, notSetValue:any, updater:any):ImutBase
  
    updateIn(keyPath:string[], notSetValue:any, updater:any):ImutBase
  
    merge() :ImutBase
  
    mergeWith():ImutBase
  
    mergeDeep():ImutBase
  
    mergeDeepWith():ImutBase
  
    withMutations(fn:any) :ImutBase
  
    cursor(path:string) :ImutBase
}
  
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
}

export interface IPluginOptions{
    getContentRect:()=>OperationPos
}

export interface IPluginManagerOptions extends IPluginOptions{

}

export interface IPlugin{
    install(commander:ICommander,mutation:IMutation,options:IPluginOptions):void
    // update(data:ImutBase,selectNodes:ImutBase[]):void
    update(data:Model,selectNodes:Model[]):void
    destroy():void
}

export interface ModelPropSchema{
    // name:string
    value:any,
    expression?:any
}

export interface ModelPropSchemas{
    [key:string]:ModelPropSchema
}

export interface UniversalObject{
    [name:string]:any
}

export type ObjectStyleDeclaration = Partial<CSSStyleDeclaration>


export enum ModelFromType {
    ISDEFAULT,
    INDEFAULT,
    ITEM
}

export interface DSL{
    data:(Model | ImgCookDsl)[]
    type:DSLType
}

export enum DSLType{
    MODEL,
    IMGCOOK
}

export enum ModelType{
    isRoot,
    isGroup,
    isArtBoard,
}

export function modelIsGroup(type:ModelType){
    return type === ModelType.isGroup
}

export function modelIsRoot(type:ModelType){
    return type === ModelType.isRoot
}

export function modelIsArtboard(type:ModelType){
    return type === ModelType.isArtBoard
}

export interface Model {
    id?:string
    name?:string
    type?:ModelType
    style?:ObjectStyleDeclaration
    propSchemas?:ModelPropSchemas
    children?:Model[]
    extra:{
        import?:{
            from :string,
            version:string,
            type:ModelFromType
        },
        label?:string,
        position?:{
            left?:number,
            top?:number,
            width?:number,
            height?:number
        },
        isSelect?:boolean
    }
}


function getValFromBaseModel(key:string,data:ImutBase){
    return data.get(key,null);
}

function getJSValFromBaseModel(key:string,data:ImutBase,defaultValue?:any){
    const result = data.get(key,defaultValue)
    if(result == null) return result;
    return result.toJS()
}

export function baseModel2Model(data:ImutBase){
    const ret = {
        id:getValFromBaseModel('id',data),
        name:getValFromBaseModel('name',data),
        // isRoot:getValFromBaseModel('isRoot',data),
        // isGroup:getValFromBaseModel('isGroup',data),
        type:getValFromBaseModel('type',data),
        style:getJSValFromBaseModel('style',data),
        propSchemas:getJSValFromBaseModel('propSchemas',data),
        extra:getJSValFromBaseModel('extra',data)
    }
    return ret;
}

export interface IRender{
    renderByDsl:(data:Model)=>void
}

export interface IMutation{
    getSelectedBaseModels(pure:boolean):ImutBase | Model[]
    getDSLData():ImutBase
    getViewModelBaseModel(id:string):ImutBase
    onModelSelected(target:ImutBase,data:{needKeep:boolean,x:number,y:number,noTrigger?:boolean}):void
}