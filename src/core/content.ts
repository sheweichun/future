import { Entity } from "../entities/index";


import {IEvent} from '../entities/index'
import {completeOptions,controlDelta} from '../utils/index';
import {CanvasEvent} from './event';
import {ContentOptions,KeyBoardKeys} from './type';
import {Model,createViewModel,ViewModel} from '../render/index'
import {Store,WrapData} from '../render/index'
import {KeyBoard} from './keyboard';
import {Commander} from './commander'
import { COMMANDERS } from "../render/type";
import {Mutation} from './mutation'
import {Operation} from './operation/index'
import {OperationPos} from './operation/pos'


function completeData(data:Model){
    if(data == null) return;
    data.extra = data.extra || {isSelect:false}
    if(!data.extra.position){
        data.extra.position = {}
    }
    data.style = data.style || {}
    data.children && data.children.forEach((child)=>{
        completeData(child)
    })
    return data;
}

export class Content implements IEvent{
    private _options:ContentOptions
    private _x:number
    private _y:number
    private _viewModel:ViewModel
    private _keyboard:KeyBoard
    private _store:Store
    private _commander:Commander
    private _mutation:Mutation
    private _operation:Operation
    private _wrapEl:HTMLElement
    private _rect:OperationPos
    constructor(private _el:HTMLElement,private _data:Model,options:ContentOptions){
        this._options = completeOptions(options,{x:0,y:0});
        
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
        this._store.subscribe((nextState:any)=>{
            this._viewModel.update(nextState.get('data'));
            this._operation.update();
            console.log('In 【content.update】');
        })
        this._commander = new Commander(this._store);
        this._mutation = new Mutation(this._store,this._commander);
        this.createWrapEl();
        this._keyboard = new KeyBoard(_el);
        this._operation = new Operation(this._el,this._mutation,this._keyboard.createNameSpace('operation'),{
            margin:this._options.margin,
            updateMakers:this._options.updateMakers
        });
        //@ts-ignore
        this._viewModel = createViewModel(null,this._store.currentState.get('data'),{
            mountNode:this._wrapEl,
            commander:this._commander,
            addViewModel:this._operation.addViewModel,
            removeViewModel:this._operation.removeViewModel,
            getRect:this.getRect
        });
        this._operation.setRootViewModel(this._viewModel);
        this._el.appendChild(this._wrapEl);
        this._operation.update();
        this.registerShortCuts();
        this.registerCommands();
        // this.test();
    }
    destroy(){
        this._keyboard.destroy();
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
    listen(){
        const rect = this._el.getBoundingClientRect()
        this._rect = new OperationPos(rect.left,rect.top,rect.width,rect.height); //必须紧接着下面代码
        this._viewModel.didMount();
        document.body.addEventListener(CanvasEvent.MOUSEDOWN,()=>{
            this._commander.excute(COMMANDERS.UNSELECTED,null);
        })
        document.body.addEventListener(CanvasEvent.DRAGSTART,()=>{
            return false;
        })
        this._operation.listen();
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
    test(){
        setTimeout(()=>{
            // console.log('children :',this._store.currentState.get('children')._deref());
            this._store.currentState.getIn(['data','children']).push(WrapData({
                id:'113',
                name:'div',
                style:{
                    width:'150px',
                    height:'150px',
                    backgroundColor:'orange'
                },
                extra:{
                    position:{
                        left:800,
                        top:400,
                    }
                }
            }))
            setTimeout(()=>{
                this._store.undo();
                setTimeout(()=>{
                    this._store.redo();
                },1000)
            },1000)
        },2000)
    }
    setStyle(){
        const {_el,_x,_y} = this;
        _el.setAttribute('style',`outline:none !important;background:#dddddd;width:100%;height:100%;transform:translate3d(${_x}px,${_y}px,0)`);
    }
    onMousewheel(deltaX:number,deltaY:number){
        // console.log('on mouse!! :',deltaX,deltaY,this._x,this._y);
        this._x += -deltaX;
        this._y += deltaY; 
        this._rect.moveLeftAndTop(-deltaX,deltaY);
        this.setStyle();
    }
    fireEvent(name:string,e:MouseEvent,repaint:()=>void):void{
        switch(name){
            case CanvasEvent.MOUSEWHEEL:
                const {wheelSpeedX,wheelSpeedY} = this._options
                const {deltaX,deltaY} = e as MouseWheelEvent;
                this.onMousewheel(controlDelta(deltaX,wheelSpeedX),controlDelta(deltaY,wheelSpeedY))
        }
    }
}