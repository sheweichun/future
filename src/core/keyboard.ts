
import {CanvasEvent,EventHandler} from './event';


export class KeyBoard extends EventHandler{
    private _keyHandleCenter:{[key:string]:any} = {
        'metaKey+z':this.undo,
        'metaKey+shiftKey+z':this.redo

    }
    constructor(private _el:HTMLElement){
        super();
        _el.tabIndex = -1000
        this.listen();
    }
    undo(){
        console.log('undo1!');
    }
    redo(){
        console.log('redo!');
    }
    onKeyDown(e:KeyboardEvent){
        const {key,metaKey,shiftKey} = e;
        let code = [metaKey ? 'metaKey+': '', shiftKey ? 'shiftKey+': '',key.toLowerCase()].join('');
        let target = this._keyHandleCenter[code];
        target && target();
        e.preventDefault();
        e.stopPropagation();
        
    }
    listen(){
        this.addEvent(this._el,CanvasEvent.KEYDOWN,this.onKeyDown.bind(this))
    }
}