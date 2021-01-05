import {ObjectStyleDeclaration,ICommander} from './type';
// import {Model,ModelProps,ObjectStyleDeclaration,ImutBase as ImutBase,ModelType,ICommander} from './model';
import {ImgCookDsl} from './imgcook'
import {IPos,OperationPos} from './pos'
import { IRenderEngine } from './render';
export interface ViewOptions{
    // localData?:any
    getLocalData?:()=>any
}


export interface ViewModelOptions extends MovableOptions{
    commander?:ICommander,
    artboardId?:string,
    renderEngine:IRenderEngine
    localData?:any
    addViewModel:(viewModel:IViewModel)=>void
    removeViewModel:(ViewModel:IViewModel)=>void
    getRootViewModel:()=>IViewModel
    getScale:()=>number
    getViewModel:(id:string)=>IViewModel
    getArtboards:(excludeIds:{[key:string]:boolean})=>IViewModel[]
    updateViewModel:(prevId:string,curVm:IViewModel)=>void
    getRect:()=>OperationPos
    isOperating:()=>boolean
    onModelStructureChange:()=>void 
}

export type ViewLifeCallback = (viewModel?:IViewModel)=>void
export type OnPositionChange = (left:number,top:number)=>void

export interface MovableOptions extends ViewOptions{
    onPostionChange?:OnPositionChange,
    onFocus?:ViewLifeCallback,
    onBlur?:ViewLifeCallback
    // id:string[],
    mountNode?:HTMLElement
    getScale:()=>number
    excute(name:number,data?:any):void
    // isRoot?:boolean
    // isGroup?:boolean
    modelType:ModelType
    isSilent?:boolean
    silentId?:number
    isIterator?:boolean
    iteratorSize?:{width:number,height:number}
    isChild?:boolean
    renderEngine?:IRenderEngine
    isOperating:()=>boolean
    vm:IViewModel
}


export interface IView<T>{
    // model:Model
    // appendChild(view:IView<T>):void
    update(model:T,opt:Partial<ViewOptions>):void
    render():void
    // getRect():DOMRect
    getRoot():HTMLElement
    getModel():T
    updateStyle(width:number,height:number):void
    destroy():void
} 


export class View implements IView<Model>{
    el:HTMLElement
    protected _options:ViewOptions
    constructor(protected _model:Model,options?:ViewOptions){
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
            if(item == null || !item.value  || item.disabled){
                el.removeAttribute(key);
            }else{
                el.setAttribute(key,item.value);
            }
        })
        if(style){
            Object.keys(style).forEach(styleName => {
                const styleItem = style[styleName]
                //@ts-ignore
                el.style[styleName] = styleItem && !styleItem.disabled ? styleItem.value : '';
            });
        }
    }
    getRoot(){
        return this.el;
    }
    update(model:Model,opt:Partial<ViewOptions>){
        const {props} = this._model;
        this._model = model
        this.updateAttribute(props,props.style);
    }
    destroy(){

    }
}



export interface IMovable{
    view:IView<Model>
    el:HTMLElement
    getRootEl():Node
    destroy():void
    mark(flag:boolean):void
    updateIsChild(isChild:boolean):void
    focus(x:number,y:number,shiftKey:boolean):void
    // mark():void
}

export interface IViewModelCollection{
    viewModelList:IViewModel[]
    didMount:()=>void
    didUpdate:()=>void
    remove():void
    size:number
    update:(model:ImutBase,forceUpdate?:boolean)=>void
    updateLocalData(data:any):void
    appendViewModel(vm:IViewModel):void
}

export interface IViewModel{
    modelType:ModelType
    children:IViewModelCollection
    updateLocalData(data:any):void
    getNewLocalData():any
    getPrevParent():IViewModel
    mark(flag:boolean):void
    getListData():any
    getChildOptions():ViewModelOptions
    resetPrevParent():void
    getModel():ImutBase
    getArtboardId():string
    getArtboard():IViewModel
    getParent():IViewModel
    getInitialParent():IViewModel
    getTypeParent(type:ModelType):IViewModel
    changeRect(target:string,diffx:number,diffy:number,onlyPos?:boolean):void
    didMount():void
    update(model:ImutBase,forceUpdate?:boolean):void
    isChildren(vm:IViewModel):boolean
    getRect():OperationPos
    updateRect(pos:IPos):void
    recalculateRect():void
    changeArtboardId(artboardId:string):void
    // setRect(pos:OperationPos):void
    getAbsRect():OperationPos
    getView():IMovable
    getRootEl():HTMLElement
    remove():void
    separate():void
    removeChildViewModel(vm:IViewModel):void
    getParentRect():{left:number,top:number}
    getViewModelByXY(x:number,y:number):IViewModel
    getRelativeRect(rect:IPos,parentRect?:{left:number,top:number}):IPos
    // updateRectByWheel(scrollX:number,scrollY:number):void
    // isInside(vm:IViewModel):boolean
    // moveLeft(diffx:number):void
    // moveTop(diffy:number):void
    // moveRight(diffx:number):void
    // moveBottom(diffy:number):void
    // canMove():boolean
    // disableMove():void
    onDidUpdate():void
    onDidMount():void
    appendChild(vm:IViewModel):void
    changePosition(diffx:number,diffy:number,onlyPos?:boolean):void
}


export interface IMutation{
    refreshAllViews():void
    getSelectedBaseModels(pure:boolean):ImutBase[] | Model[]
    getAllSelectedViewModels():IViewModel[]
    getDSLData():ImutBase
    getViewModelBaseModel(id:string):ImutBase
    onModelSelected(target:ImutBase,data:{needKeep:boolean,x:number,y:number,noTrigger?:boolean}):void
    changeDisplayName(id:string,displayName:string):void
    updateModelPosition(data:IPos):void
    updateModelStyle(data:Partial<CSSStyleDeclaration>):void
    updateModelProps(key:string,data:any):void
    updateModelPropsByKeyPath(key:string[],data:any):void
}

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

export type AttrPropType = {
    modelData:Model[]
    renderVarInput:RenderVarInput
    schema:ModelPropSchema
    selectModel:Model
    mutation:IMutation
}

export type AttrStateType = {
    value:ModelAttrValue
}

export interface ModelAttrValue{
    value:any,
    // showValue?:any
    expression?:string
    isExp?:boolean
    disabled?:boolean
    onlyExp?:boolean
}

export interface ModelProps{
    [key:string]:ModelAttrValue
}

export interface ModelAttrProto{
    type:ModelPropComponentType,
    title:string,
    key:string
    sortIndex:number,
    props:{
        [key:string]:any
    },
    get?(model:Model):void,
    update?(mutation:IMutation,modelData:Model[],data:any):void
}


export interface ModelPos{
    left?:number,
    top?:number,
    width?:number,
    height?:number
}

export type ModelPosKeys = keyof ModelPos

export interface Model {
    id?:string
    pid?:string
    protoId?:string
    name?:string
    displayName?:string
    type?:ModelType
    props:ModelProps
    children?:Model[]
    proto?:{
        import?:{
            from :string,
            version:string,
            type:ModelFromType
        },
        attrs?:ModelAttrProto[]
    }
    extra:{
        label?:string,
        position?:ModelPos,
        isSelect?:boolean
    }
}


function getValFromImutBase(key:string,data:ImutBase){
    return data.get(key,null);
}

function getJSValFromImutBase(key:string,data:ImutBase,defaultValue?:any){
    const result = data.get(key,defaultValue)
    if(result == null) return result;
    return result.toJS()
}



export function baseModel2Model(data:ImutBase):Model{
    const ret = {
        id:getValFromImutBase('id',data),
        name:getValFromImutBase('name',data),
        pid:getValFromImutBase('pid',data),
        protoId:getValFromImutBase('protoId',data),
        displayName:getValFromImutBase('displayName',data),
        type:getValFromImutBase('type',data),
        style:getJSValFromImutBase('style',data),
        props:getJSValFromImutBase('props',data),
        extra:getJSValFromImutBase('extra',data)
    }
    return ret;
}

export enum ModelFromType {
    ISDEFAULT,
    INDEFAULT,
    ITEM
}

export type DSLModel = (Model | ImgCookDsl)[]

export interface DSL{
    data:DSLModel
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
    isFrame
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


export enum ModelPropComponentType{
    backgroundColor,
    text,
    xywh,
    select,
    switch
}

export interface ModelPropSchema{
    type:ModelPropComponentType,
    identity?:string,
    title?:string
    key:string
    sortIndex:number
    props?:{[key:string]:any}
    get?:(val:Model)=>any
    update?:(mutation:IMutation,model:Model[],target:any)=>void
}

export interface ModelPropSchemaMap{
    [key:string]:ModelPropSchema[]
}

// export type RenderVarInput = (data:Model[],mut:IMutation)=>JSX.Element 
export type RenderVarInput = (data:Model[],schema:ModelPropSchema,mut:IMutation,state:ModelAttrValue)=>JSX.Element 

export interface IPlugin{
    install(commander:ICommander,mutation:IMutation,options:IPluginOptions):void
    // update(data:ImutBase,selectNodes:ImutBase[]):void
    update(data:Model,selectNodes:Model[],vms:IViewModel[]):void
    destroy():void
}

export interface IPluginOptions{
    getContentRect:()=>OperationPos
}

export interface IPluginManagerOptions extends IPluginOptions{

}

export interface IRender{
    renderByDsl:(data:Model)=>void
}