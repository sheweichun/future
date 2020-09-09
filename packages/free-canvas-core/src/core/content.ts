// import { Entity } from "../entities/index";


import {IEvent} from '../entities/index'
import {completeOptions} from '../utils/index';
import {CanvasEvent} from '../events/event';
import {ContentOptions,KeyBoardKeys} from './type';
import {Model,createViewModel,Store,completeData} from '../render/index'
// import {Store,WrapData} from '../render/index'
import {KeyBoard} from './keyboard';
import {Commander} from './commander'
import {COMMANDERS, IPlugin} from 'free-canvas-shared'
import {Mutation} from './mutation'
import {Operation} from './operation/index'
import {OperationPos} from './operation/pos'
import {RectSelect} from './rectSelect'
import { MoveEventData } from "../events/type";
import {PluginManager} from './pluginManager';
import { IViewModel } from '../render/type';
import {GuideManager} from './guide/index'


// function completeData(data:Model){
//     if(data == null) return;
//     data.extra = data.extra || {isSelect:false}
//     if(!data.extra.position){
//         data.extra.position = {}
//     }
//     data.style = data.style || {}
//     data.children && data.children.forEach((child)=>{
//         completeData(child)
//     })
//     return data;
// }

function calculateRectData(data:MoveEventData){
    if(data == null) return;
    const {x,y,originX,originY} = data;
    let startX,startY,width,height;
    if(originX < x){
        startX = originX;
        width = x - originX;
    }else{
        startX = x;
        width = originX - x;
    }
    if(originY < y){
        startY = originY;
        height = y - originY;
    }else{
        startY = y;
        height = originY - y;
    }
    return new OperationPos(startX,startY,width,height)
}

export class Content implements IEvent{
    private _options:ContentOptions
    private _x:number
    private _y:number
    private _viewModel:IViewModel
    private _keyboard:KeyBoard
    private _store:Store
    private _commander:Commander
    private _mutation:Mutation
    private _operation:Operation
    private _wrapEl:HTMLElement
    private _rect:OperationPos
    private _rectSelect:RectSelect
    private _pluginManager:PluginManager
    private _el:HTMLElement
    constructor(private _parent:HTMLElement,_data:Model,private _guideManager:GuideManager,options:ContentOptions){
        this._options = completeOptions(options,{x:0,y:0});
        this._el = document.createElement('div');
        this._x = this._options.x;
        this._y = this._options.y;
        this.setStyle();
        this._store = new Store({
            data:completeData(_data),
            selectedKeyPaths:[]
        },{
            prototype:{
            }
        });
        this.getRect = this.getRect.bind(this)
        this.isOperating = this.isOperating.bind(this)
        this.getRootViewModel = this.getRootViewModel.bind(this);
        this._store.subscribe((nextState:any)=>{
            this._viewModel.update(nextState.get('data'));
            this._operation.update();
            this._pluginManager.update();
            console.log('In 【content.update】');
        })
        this._commander = new Commander(this._store);
        this._mutation = new Mutation(this._el,this._store,this._commander,{
            getRect:this.getRect
        });
        this._pluginManager = new PluginManager(this._commander,this._mutation,{
            getContentRect:this.getRect
        });
        this.createWrapEl();
        this._keyboard = new KeyBoard(_parent);
        this._keyboard.listen();
        this._operation = new Operation(this._el,this._mutation,this._guideManager,this._keyboard.createNameSpace('operation'),{
            margin:this._options.margin,
            getRect:this.getRect,
            updateMakers:this._options.updateMakers
        });
        this._mutation.setOperation(this._operation);
        const storeData = this._store.currentState
        //@ts-ignore
        this._viewModel = createViewModel(null,storeData.get('data'),{
            mountNode:this._wrapEl,
            commander:this._commander,
            createView:this._options.createView,
            addViewModel:this._operation.addViewModel,
            getViewModel:this._operation.getViewModel,
            removeViewModel:this._operation.removeViewModel,
            updateViewModel:this._operation.updateViewModel,
            getRootViewModel:this.getRootViewModel,
            getArtboards:this._operation.getArtboards,
            getRect:this.getRect,
            isOperating:this.isOperating
        });
        this._rectSelect = new RectSelect(document.body,{
            updateRectSelect:this.updateRectSelect.bind(this)
        })
        this._operation.setRootViewModel(this._viewModel);
        this._el.appendChild(this._wrapEl);
        this._operation.update();
        this.registerShortCuts();
        this.registerCommands();
        // this.test();
    }
    isOperating(){
        return this._operation.isOperating
        // return false
    }
    getRootViewModel(){
        return this._viewModel;
    }
    getRoot(){
        return this._el;
    }
    getCurrentData(){
        return this._store.currentState.get('data').toJS();
    }
    installPlugin(plugin:IPlugin){
        this._pluginManager.install(plugin);
    }
    uninstallPlugin(plugin:IPlugin){
        this._pluginManager.uninstall(plugin);
    }
    destroy(){
        this._keyboard.destroy();
        this._pluginManager.destroy();
        this._mutation.destroy();
    }
    getRect(){
        return this._rect
    }
    createWrapEl(){
        const wrapEl = document.createElement('div');
        wrapEl.setAttribute('style','position:relative;width:100%;height:100%');
        this._wrapEl = wrapEl;
        return this._wrapEl;
    }
    triggerSelectList(pos:OperationPos){
        this._mutation.updateSelectVmsByPos(this._store.currentState.get('data'),this._viewModel,pos);
    }
    initRect(){
        const rect = this._el.getBoundingClientRect()
        this._rect = new OperationPos(rect.left,rect.top,rect.width,rect.height);
    }
    listen(){
        // const rect = this._el.getBoundingClientRect()
        // this._rect = new OperationPos(rect.left,rect.top,rect.width,rect.height); //必须紧接着下面代码
        this.initRect(); //必须紧接着下面代码
        this._viewModel.didMount();
        document.body.addEventListener(CanvasEvent.MOUSEDOWN,()=>{
            this._commander.excute(COMMANDERS.UNSELECTED,null);
        })
        document.body.addEventListener(CanvasEvent.DRAGSTART,()=>{
            return false;
        })
        this._operation.listen();
        this._rectSelect.listen();
    }
    registerShortCuts(){
        const {_keyboard} = this;
        _keyboard.registerShortcut([KeyBoardKeys.METAKEY,'z'],{
            fn:this.undo,
            context:this
        })
        _keyboard.registerShortcut([KeyBoardKeys.METAKEY,KeyBoardKeys.SHIFTKEY,'z'],{
            fn:this.redo,
            context:this
        })
        _keyboard.registerShortcut([KeyBoardKeys.METAKEY,'c'],{
            fn:this._mutation.copy,
            context:this._mutation
        })
        _keyboard.registerShortcut([KeyBoardKeys.METAKEY,'v'],{
            fn:this._mutation.paste,
            context:this._mutation
        })
    }
    updateRectSelect(data:MoveEventData){
        const pos = calculateRectData(data);
        this._options.updateRectSelect(pos);
    }
    registerCommands(){
        this._mutation.register();
    }
    undo(){
        this._store.undo();
    }
    redo(){
        this._store.redo();
    }
    // test(){
    //     setTimeout(()=>{
    //         // console.log('children :',this._store.currentState.get('children')._deref());
    //         this._store.currentState.getIn(['data','children']).push(WrapData({
    //             id:'113',
    //             name:'div',
    //             style:{
    //                 width:'150px',
    //                 height:'150px',
    //                 backgroundColor:'orange'
    //             },
    //             extra:{
    //                 position:{
    //                     left:800,
    //                     top:400,
    //                 }
    //             }
    //         }))
    //         setTimeout(()=>{
    //             this._store.undo();
    //             setTimeout(()=>{
    //                 this._store.redo();
    //             },1000)
    //         },1000)
    //     },2000)
    // }
    setStyle(){
        const {_el,_x,_y} = this;
        _el.setAttribute('style',`outline:none !important;width:100%;height:100%;transform:matrix(1,0,0,1,${_x},${_y})`);
        // _el.setAttribute('style',`outline:none !important;width:100%;height:100%;transform:translate(${_x}px,${_y}px)`);
    }
    changeTranslation(x:number,y:number){
        this._x = x;
        this._y = y;
        this.setStyle();
        this.initRect();
    }
    onMousewheel(deltaX:number,deltaY:number){
        // console.log('on mouse!! :',deltaX,deltaY,this._x,this._y);
        this._x += -deltaX;
        this._y += -deltaY; 
        this._rect.moveLeftAndTop(-deltaX,-deltaY);
        this.setStyle();
    }
    fireEvent(name:string,e:MouseWheelEvent,repaint:()=>void):void{
        switch(name){
            case CanvasEvent.MOUSEWHEEL:
                // const {wheelSpeedX,wheelSpeedY} = this._options
                const {deltaX,deltaY} = e as MouseWheelEvent;
                this.onMousewheel(deltaX,deltaY)
        }
    }
}