
import {completeOptions} from '../utils/index';
import {CONTEXT_MEUNU,CONTEXT_MEUNU_ITEM,CONTEXT_MEUNU_ITEM_SECTION} from '../utils/constant'
import {ContextMenuData,ContextMenuItem} from './type'
import {CanvasEvent} from 'free-canvas-shared'
import { ContextMenuDataItem } from '.';
export {ContextMenuData,ContextMenuItem,ContextMenuDataItem} from './type'
const DEFAULT_OPTIONS = {

}

function stopPropagation(e:MouseEvent){
    e.stopPropagation()
}

const MIN_DISTANCE = 20

function preventDefault(e:MouseEvent){
    e.preventDefault()
}

function style2Str(style:CSSStyleDeclaration){
    let ret:string[] = []
    Object.keys(style).forEach((name:string)=>{
        const newName = name.replace(/[A-Z]/g,(val)=>{return `-${val.toLocaleLowerCase()}`})
        ret.push(`${newName}:${style[name as keyof CSSStyleDeclaration]}`)
    })
    return ret.join(';')
}



export class ContextMenu{
    // private _options:ContextMenuOptions
    // private _maskEl:HTMLElement
    private _menuEl:HTMLElement
    private _isShow:boolean = false;
    private _menuItemList:ContextMenuItem[] = []
    private _activeItem:ContextMenuItem
    private _menuData:ContextMenuData[]
    constructor(private _rootEl:HTMLElement){
        // this._options = completeOptions(options,DEFAULT_OPTIONS);
        // this.showMenu = this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
        this.clearMenu = this.clearMenu.bind(this);
        const innerDiv = document.createElement('div');
        innerDiv.className = CONTEXT_MEUNU
        // const styleStr = style2Str(Object.assign({
        //     position:'absolute'
        // } as CSSStyleDeclaration,style || {}))
        // innerDiv.setAttribute('style',styleStr);
        innerDiv.addEventListener(CanvasEvent.MOUSEDOWN,stopPropagation);
        innerDiv.addEventListener(CanvasEvent.CLICK,this.hideMenu);
        innerDiv.addEventListener(CanvasEvent.CONTEXTMENU,preventDefault);
        _rootEl.addEventListener(CanvasEvent.CLICK,this.clearMenu);
        _rootEl.addEventListener(CanvasEvent.BLUR,this.clearMenu);
        // document.body.addEventListener(CanvasEvent.CLICK,this.clearMenu)
        this._menuEl = innerDiv;
    }
    bind(item:ContextMenuItem){
        const {el} = item
        item.onContextMenu = this.showMenu.bind(this,item);
        el.addEventListener(CanvasEvent.CONTEXTMENU,item.onContextMenu);
        this._menuItemList.push(item);
        return this;
    }
    unbind(item:ContextMenuItem){
        const {_menuItemList} = this
        for(let i = 0 ; i < _menuItemList.length; i++){
            const data = _menuItemList[i];
            if(data.el === item.el){
                item.el.removeEventListener(CanvasEvent.CONTEXTMENU,item.onContextMenu)
                _menuItemList.splice(i,1);
                return;
            }
        }
    }
    destroy(){
        const {_menuEl,_rootEl} = this
        this._menuItemList.forEach((item)=>{
            item.el.removeEventListener(CanvasEvent.CONTEXTMENU,item.onContextMenu)
        })
        _menuEl.removeEventListener(CanvasEvent.CLICK,this.hideMenu);
        _menuEl.removeEventListener(CanvasEvent.CONTEXTMENU,preventDefault);
        _menuEl.removeEventListener(CanvasEvent.MOUSEDOWN,stopPropagation);
        // document.body.removeEventListener(CanvasEvent.CLICK,this.clearMenu)
        _rootEl.removeEventListener(CanvasEvent.CLICK,this.clearMenu)
        _rootEl.removeEventListener(CanvasEvent.BLUR,this.clearMenu);
        this._rootEl = null;
    }
    render(x:number,y:number,data:ContextMenuData[]){
        if(data == null || data.length === 0) return;
        const {_menuEl,_activeItem} = this;
        const styleStr = style2Str(Object.assign({
            position:'absolute',
            left:`${x}px`,
            visibility:'none',
            top:`${y}px`
        } as CSSStyleDeclaration,_activeItem.style || {}))
        _menuEl.setAttribute('style',styleStr);
        _menuEl.innerHTML = data.map((items,gindex)=>{
            return `<div class="${CONTEXT_MEUNU_ITEM_SECTION}">
                ${
                    items.children && items.children.map((item,index)=>{
                        return `<div class="${CONTEXT_MEUNU_ITEM}" data-index="${index}" data-gindex="${gindex}">
                            ${item.label}
                        </div>`
                    }).join('')
                }
            </div>`
            
        }).join('')
        const {right,bottom,width} = _menuEl.getBoundingClientRect()
        const doEl = document.documentElement
        const {clientWidth,clientHeight} = doEl
        if(bottom + MIN_DISTANCE > clientHeight){
            y += clientHeight - bottom - MIN_DISTANCE
        }
        if(right + MIN_DISTANCE > clientWidth){
            x -= width
        }
        const menuStyle = _menuEl.style
        menuStyle.left = `${x}px`
        menuStyle.top = `${y}px`
        menuStyle.visibility = 'visible'
    }
    isShowing(){
        return this._isShow
    }
    showMenu(item:ContextMenuItem,e:MouseEvent){
        e.preventDefault();
        if(this._activeItem && this._activeItem !== item){
            this.clearMenu();
        }
        this._menuEl.style.visibility = 'none'
        if(!this._isShow){
            // document.body.appendChild(this._maskEl);
            this._rootEl.appendChild(this._menuEl);
        }
        this._activeItem = item;
        this._isShow = true;
        const {getMenuData} = item;
        const menuData = getMenuData(e);
        const {x,y} = e;
 
        this._menuData = menuData;
        // console.log('showMenu !');
        this.render(x,y,menuData);
    }
    onClickMenuItem(data:ContextMenuDataItem){
        if(data && data.callback){
            return data.callback(data);
        }
    }
    hideMenu(e:MouseEvent){
        const {target} = e
        e.stopPropagation();
        const dataset = (target as HTMLElement).dataset;
        const itemIndex = parseInt(dataset.index);
        const itemGIndex = parseInt(dataset.gindex);
        if(itemIndex != null && itemGIndex != null && this._menuData){
            const group = this._menuData[itemGIndex];
            if(group != null && group.children != null){
                const ret = this.onClickMenuItem(group.children[itemIndex])
                if(ret){
                    return
                }
            }
        }
        this.clearMenu()
    }
    clearMenu(){
        if(!this._isShow) return
        const {onHide} = this._activeItem
        if(onHide){
            onHide();
        }
        this._activeItem = null;
        this._menuData = null;
        // console.log('_isShow :',this._isShow);
        this._isShow = false;
        // document.body.removeChild(this._maskEl);
        this._rootEl.removeChild(this._menuEl);
    }
}

let GlobalContextMenu:ContextMenu

export function initGlobalContextMenu(el:HTMLElement){
    GlobalContextMenu = new ContextMenu(el)
}

export function registerContextMenu(data:ContextMenuItem){
    return GlobalContextMenu.bind(data);
}

export function unregisterContextMenu(data:ContextMenuItem){
    return GlobalContextMenu.unbind(data);
}