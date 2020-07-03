import { Entity } from "../entities/index";


import {IEvent} from '../entities/index'
import {completeOptions,controlDelta} from '../utils/index';
import {CanvasEvent} from './event';
import {ContentOptions} from '../components/type';
import {Model,createViewModel,ViewModel} from '../render/index'
import {Store,WrapData} from '../render/index'
import {KeyBoard} from './keyboard';




export class Content implements IEvent{
    private _options:ContentOptions
    private _x:number
    private _y:number
    private _viewModel:ViewModel
    private _curSelectViewModel:ViewModel
    private _keyboard:KeyBoard
    private _store:Store
    constructor(private _el:HTMLElement,private _data:Model,options:ContentOptions){
        this._options = completeOptions(options,{x:0,y:0});
        this._x = this._options.x;
        this._y = this._options.y;
        this.setStyle();
        this._store = new Store(_data,{
            prototype:{

            }
        });
        this._store.subscribe((nextState:any)=>{
            console.log('in update');
            this._viewModel.update(nextState);
        })
        //@ts-ignore
        this._viewModel = createViewModel(null,this._store.currentState,_el);
        this._keyboard = new KeyBoard(_el,this._store);
        // this.test();
    }
    test(){
        setTimeout(()=>{
            // console.log('children :',this._store.currentState.get('children')._deref());
            this._store.currentState.get('children').push(WrapData({
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