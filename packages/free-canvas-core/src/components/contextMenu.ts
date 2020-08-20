
import {completeOptions} from '../utils/index';
import {CONTEXT_MEUNU,CONTEXT_MEUNU_ITEM} from '../utils/constant'
import {ContextMenuOptions,ContextMenuData} from './type'
import {CanvasEvent} from 'free-canvas-shared'
export {ContextMenuData} from './type'
const DEFAULT_OPTIONS = {

}

function stopPropagation(e:MouseEvent){
    e.stopPropagation()
}

export class ContextMenu{
    private _options:ContextMenuOptions
    private _triggleEl:HTMLElement
    private _maskEl:HTMLElement
    private _menuEl:HTMLElement
    private _isShow:boolean = false;
    private _menuData:ContextMenuData[];
    constructor(options:ContextMenuOptions){
        this._options = completeOptions(options,DEFAULT_OPTIONS);
        this.showMenu = this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
    }
    bind(el:HTMLElement){
        this._triggleEl = el;
        const div = document.createElement('div');
        div.setAttribute('style','position:fixed;left:0;top:0;right:0;bottom:0')
        const innerDiv = document.createElement('div');
        innerDiv.className = CONTEXT_MEUNU
        innerDiv.setAttribute('style','position:absolute')
        div.appendChild(innerDiv);
        el.addEventListener(CanvasEvent.CONTEXTMENU,this.showMenu)
        div.addEventListener(CanvasEvent.CONTEXTMENU,this.showMenu)
        div.addEventListener(CanvasEvent.CLICK,this.hideMenu)
        this._maskEl = div;
        this._menuEl = innerDiv;
        return this;
    }
    destroy(){
        const {_triggleEl,_maskEl} = this
        _triggleEl.removeEventListener(CanvasEvent.CONTEXTMENU,this.showMenu)
        _maskEl.removeEventListener(CanvasEvent.CLICK,this.hideMenu)
        _maskEl.removeEventListener(CanvasEvent.CONTEXTMENU,this.showMenu)
    }
    render(data:ContextMenuData[]){
        if(data == null || data.length === 0) return;
        this._menuEl.innerHTML = data.map((item,index)=>{
            return `<div class="${CONTEXT_MEUNU_ITEM}" data-index="${index}">
                ${item.label}
            </div>`
        }).join('')
    }
    showMenu(e:MouseEvent){
        e.preventDefault();
        if(!this._isShow){
            document.body.appendChild(this._maskEl);
        }
        this._isShow = true;
        const {getMenuData} = this._options
        const menuData = getMenuData(e);
        this._menuData = menuData;
        const {x,y} = e;
        const {_menuEl} = this;
        _menuEl.style.left = `${x}px`
        _menuEl.style.top = `${y}px`
        // console.log('showMenu !');
        this.render(menuData);
    }
    onClickMenuItem(data:ContextMenuData){
        if(data && data.callback){
            data.callback(data);
        }
    }
    hideMenu(e:MouseEvent){
        const {target} = e
        //@ts-ignore
        const itemIndex = target.dataset.index;
        if(itemIndex != null && this._menuData){
            this.onClickMenuItem(this._menuData[itemIndex])
        }
        const {onHide} = this._options
        onHide && onHide();
        if(!this._isShow) return
        this._isShow = false;
        document.body.removeChild(this._maskEl);
        this._menuData = null;
    }
}