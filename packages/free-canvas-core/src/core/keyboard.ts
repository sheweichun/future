
import {CanvasEvent,EventHandler} from '../events/event';
// import {Store} from '../render/index'
import {IKeyBoard,ShortCutCallback,ShortCutItem,KeyBoardKeys} from './type'


function keysToKeyStr(keys:string[],split='+'){
    let ret:string = null;
    keys.forEach((val)=>{
        if(!val) return ret;
        const valStr = val.toLowerCase();
        if(ret == null){
            ret = valStr
        }else{
            ret += split + valStr;
        }
    })
    return ret;
}

export class KeyBoard  extends EventHandler implements IKeyBoard{
    private _keyHandleCenter:{[key:string]:ShortCutItem} = {
        // 'metaKey+z':{fn:this.undo},
        // 'metaKey+shiftKey+z':{fn:this.redo}

    }
    private _keyHandleNameSpaceCenter:{
        [key:string]:KeyBoard
    } = {}
    constructor(private _el?:HTMLElement){
        super();
        if(_el != null){
            _el.tabIndex = -1000
            this.listen();
        }
    }
    getKeyHandlerCenter(){
        return this._keyHandleCenter;
    }
    createNameSpace(ns:string){
        if(this._keyHandleNameSpaceCenter[ns]) return this._keyHandleNameSpaceCenter[ns];
        const keyboard = new KeyBoard();
        this._keyHandleNameSpaceCenter[ns] = keyboard;
        const prevDestroy = keyboard.destroy;
        keyboard.destroy = function(){
            prevDestroy.apply(keyboard)
            this._keyHandleNameSpaceCenter[ns] = null;
            delete this._keyHandleNameSpaceCenter[ns]
        }
        return keyboard;
    }
    registerShortcut(keys:string[],item:ShortCutItem):boolean{
        this._keyHandleCenter[keysToKeyStr(keys)] = item;
        return true;
    }
    unregisterShortcut(keys:string[]){
        this._keyHandleCenter[keys.join('+')] = null;
        delete this._keyHandleCenter[keysToKeyStr(keys)];
        return true;
    }
    destroy(){
        this._keyHandleCenter = {};
        super.destroy();
    }
    // undo(){
    //     this._store.undo();
    // }
    // redo(){
    //     this._store.redo();
    // }
    onKeyDown(e:KeyboardEvent){
        const {key,metaKey,shiftKey} = e;
        // console.log('E :',e);
        let code = keysToKeyStr([metaKey ? 'metaKey': null, shiftKey ? 'shiftKey': null,key]);
        let target = this._keyHandleCenter[code];
        if(target){
            const {fn,params,context} = target;
            fn.apply(context,params);
        }
        Object.keys(this._keyHandleNameSpaceCenter).forEach((ns)=>{
            const keyboard = this._keyHandleNameSpaceCenter[ns];
            let nsTarget = keyboard.getKeyHandlerCenter()[code];
            if(nsTarget){
                const {fn,params,context} = nsTarget;
                fn.apply(context,params);
            }
        })
        e.preventDefault();
        e.stopPropagation();
        
    }
    listen(){
        if(this._el == null) return;
        this.addEvent(this._el,CanvasEvent.KEYDOWN,this.onKeyDown.bind(this))
    }
}