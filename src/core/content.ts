import { Entity } from "../entities/index";


import {IEvent} from '../entities/index'
import {completeOptions,controlDelta} from '../utils/index';
import {CanvasEvent} from './event';
import {ContentOptions} from '../components/type';
import {Model,createViewModel,ViewModel,ViewModelCollection} from '../render/index'
import {KeyBoard} from './keyboard';




export class Content implements IEvent{
    private _options:ContentOptions
    private _x:number
    private _y:number
    private _viewModels:ViewModelCollection
    private _curSelectViewModel:ViewModel
    private _keyboard:KeyBoard
    constructor(private _el:HTMLElement,private _data:Model[],options:ContentOptions){
        this._options = completeOptions(options,{x:0,y:0});
        this._x = this._options.x;
        this._y = this._options.y;
        this.setStyle();
        this._viewModels = createViewModel(null,_data,_el);
        this._keyboard = new KeyBoard(_el);
        setTimeout(()=>{
            _data.push({
                //@ts-ignore
                id:'112',
                tag:'div',
                attribute:{
                    style:{
                        left:'800px',
                        top:'400px',
                        width:'150px',
                        height:'150px',
                        backgroundColor:'orange'
                    }
                }
            })
            this._viewModels.update(_data);
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