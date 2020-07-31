
import {ListenRecord,ListenFunc} from '../core/type';
export {CanvasEvent} from 'free-canvas-shared';
// export enum CanvasEvent {
//     MOUSEWHEEL="mousewheel",
//     CLICK="click",
//     DBCLICK="dblclick",
//     MOUSEDOWN="mousedown",
//     MOUSEMOVE="mousemove",
//     MOUSEENTER="mouseenter",
//     MOUSELEAVE="mouseleave",
//     MOUSEUP="mouseup",
//     FOUCS="focus",
//     BLUR="blur",
//     KEYDOWN="keydown",
//     KEYUP="keyup",
//     DRAGSTART="dragstart",
//     DRAGOVER="dragover"
// }


export class EventHandler{
    protected _listeners:ListenRecord[] = [];
    constructor(){
    }

    addEvent(el:HTMLElement,name:string,func:ListenFunc){
        this._listeners.push({
            name,
            listener:func,
            el
        })
        el.addEventListener(name,func);
    }
    removeEvent(el:HTMLElement,name:string,func:ListenFunc){
        this._listeners = this._listeners.filter((item)=>{
            return !(el === item.el && name === item.name && func === item.listener)
        })
        el.removeEventListener(name,func);
    }
    destroy(){
        this._listeners.forEach((item)=>{
            item.el.removeEventListener(item.name,item.listener);
        })
    }
}