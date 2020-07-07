
import {CanvasEvent,EventHandler} from './event';
import {Store} from '../render/index'
import {IKeyBoard,ShortCutCallback,ShortCutItem} from './type'

export enum KeyBoardKeys {
    METAKEY = 'metaKey',
    SHIFTKEY = 'shiftKey',
    ALTKEY = 'altKey'
}

export class KeyBoard  extends EventHandler implements IKeyBoard{
    private _keyHandleCenter:{[key:string]:ShortCutItem} = {
        // 'metaKey+z':{fn:this.undo},
        // 'metaKey+shiftKey+z':{fn:this.redo}

    }
    constructor(private _el:HTMLElement){
        super();
        _el.tabIndex = -1000
        this.listen();
    }
    registerShortcut(keys:string[],item:ShortCutItem):boolean{
        this._keyHandleCenter[keys.join('+')] = item;
        return true;
    }
    // undo(){
    //     this._store.undo();
    // }
    // redo(){
    //     this._store.redo();
    // }
    onKeyDown(e:KeyboardEvent){
        const {key,metaKey,shiftKey} = e;
        let code = [metaKey ? 'metaKey+': '', shiftKey ? 'shiftKey+': '',key.toLowerCase()].join('');
        let target = this._keyHandleCenter[code];
        if(target){
            const {fn,params,context} = target;
            fn.apply(context,params);
        }
        e.preventDefault();
        e.stopPropagation();
        
    }
    listen(){
        this.addEvent(this._el,CanvasEvent.KEYDOWN,this.onKeyDown.bind(this))
    }
}