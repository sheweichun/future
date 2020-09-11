
import {CanvasEvent} from 'free-canvas-shared';
import {ARTBOARD_HORIZONTAL_GUIDE,ARTBOARD_VERTICAL_GUIDE} from '../../utils/constant';
import {completeOptions} from '../../utils/index'
import {registerContextMenu,unregisterContextMenu,ContextMenuData, ContextMenuItem, ContextMenu,ContextMenuDataItem} from '../../components/index'
import {GuideOptions} from './type';


const DEFAULT_OPTIONS = {
    gap:2
}


// class GuideLien{
//     constructor(private _el:HTMLElement){
//         _el.style.pointerEvents = 'all';
//         _el.addEventListener('')
//     }
// }

export abstract class Guide{
    protected guideList:HTMLElement[] = []
    protected retrieveGuideList:HTMLElement[] = []
    protected guideEl:HTMLElement
    protected curGuide:HTMLElement
    protected _contextMenuGuide:HTMLElement
    protected _options:GuideOptions
    protected _contextMenuItem:ContextMenuItem
    protected _contextMenu:ContextMenu
    private _isShowing:boolean = false;
    // protected _offset:number
    // protected _canvasLeave:boolean = true
    protected _className:string
    constructor(protected _rootEl:HTMLElement,options:GuideOptions){
        this._options = completeOptions(options,DEFAULT_OPTIONS)
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.getMenuData = this.getMenuData.bind(this);
        this.onClick = this.onClick.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
        this.removeAllGuides = this.removeAllGuides.bind(this)
    }
    // abstract onMouseEnter(e:MouseEvent):void
    // abstract onMouseMove(e:MouseEvent):void

    getOffsetList(){
        return this.guideList.map((el)=>{
            return parseFloat(el.dataset.value);
        })
    }
    // abstract onMouseLeave(e:MouseEvent):void
    addGuide(el:HTMLElement){
        el.style.pointerEvents = 'all';
        this.guideList.push(el);
    }
    onClick(e:MouseEvent):void{
        // console.log('e :',e);
        if(this.curGuide == null || this._isShowing) return;
        const newCurGuide = this.curGuide.cloneNode() as HTMLElement;
        // this._rootEl.appendChild(newCurGuide);
        this.guideEl.appendChild(newCurGuide);
        this.addGuide(this.curGuide);
        this.curGuide = newCurGuide;
    }
    onMouseEnter(e:MouseEvent):boolean | void{
        return false;
    }
    onMouseMove(e:MouseEvent):boolean | void{
        return false;
    }
    onMouseLeave(e?:MouseEvent){
        if(this.curGuide == null ) return
        this.retrieveGuideList.push(this.curGuide);
        // this._rootEl.removeChild(this.curGuide);
        this.guideEl.removeChild(this.curGuide);
        this.curGuide = null
    }
    getNewGuide(){
        let guide = this.retrieveGuideList.shift()
        if(guide == null){
            guide = document.createElement('div');
        }
        return guide;
    }
    getGuideStyle(styleStr:string){
        return `${styleStr};display:${this._isShowing ? 'none':'block'}`
    }
    removeAllGuides(){
        const {guideList} = this;
        if(guideList == null || guideList.length === 0) return;
        this.retrieveGuideList.push(...guideList.map((item)=>{
            // this._rootEl.removeChild(item);
            this.guideEl.removeChild(item);
            return item;
        }))
        this.guideList = [];
    }
    destroy(){
        const {guideEl} = this
        guideEl.parentNode.removeChild(guideEl);
        guideEl.removeEventListener(CanvasEvent.MOUSEENTER,this.onMouseEnter)
        guideEl.removeEventListener(CanvasEvent.MOUSEMOVE,this.onMouseMove)
        guideEl.removeEventListener(CanvasEvent.MOUSELEAVE,this.onMouseLeave)
        guideEl.removeEventListener(CanvasEvent.CLICK,this.onClick)
        // this._contextMenu.destroy()
        unregisterContextMenu(this._contextMenuItem)
        this._contextMenu = null;
        this.guideList = [];
        this.retrieveGuideList = [];
    }
    removeGuideFromList(target:HTMLElement){
        for(let i = 0; i < this.guideList.length ; i++){
            const item = this.guideList[i];
            if(item === target){
                this.guideList.splice(i,1);
                this.guideEl.removeChild(item);
                this.retrieveGuideList.push(item);
                return
            }
        }
    }
    getMenuData(e:MouseEvent):ContextMenuData[]{
        const {target} = e;
        const {curGuide,_contextMenuGuide}  = this;
        this._isShowing = true;
        if(_contextMenuGuide == null && curGuide){
            this._contextMenuGuide = curGuide.cloneNode() as HTMLElement;
            this.guideEl.appendChild(this._contextMenuGuide);
            curGuide.style.display = 'none'
        }
        // this._canvasLeave = false;
        const menuList:ContextMenuDataItem[] = [
            {
                label:'移除所有参考线',
                callback:this.removeAllGuides
            }
        ]
        if((target as HTMLElement).className === this._className){
            menuList.unshift({
                label:'移除参考线',
                callback:this.removeGuideFromList.bind(this,target)
            })
        }
        return [
            {
                children:menuList
            }
        ]
    }
    hideMenu(){
        const {curGuide,_contextMenuGuide}  = this;
        if(curGuide){
            curGuide.style.display = 'block'
        }
        if(_contextMenuGuide){
            this.guideEl.removeChild(this._contextMenuGuide);
            this._contextMenuGuide = null;
        }
        this._isShowing = false;
        // this._canvasLeave = true;
        // this.onMouseLeave();
    }
    abstract mount(el:HTMLElement):void
    listen(){
        const {guideEl} = this
        this._contextMenuItem = {
            getMenuData:this.getMenuData,
            onHide:this.hideMenu,
            el:guideEl
        }
        this._contextMenu = registerContextMenu(this._contextMenuItem);
        guideEl.addEventListener(CanvasEvent.MOUSEENTER,this.onMouseEnter)
        guideEl.addEventListener(CanvasEvent.MOUSEMOVE,this.onMouseMove)
        guideEl.addEventListener(CanvasEvent.MOUSELEAVE,this.onMouseLeave)
        guideEl.addEventListener(CanvasEvent.CLICK,this.onClick)
        
        return this;
    }
}

export class VGuide extends Guide{
    constructor(protected _rootEl:HTMLElement,options:GuideOptions){
        super(_rootEl,options);
        this._className = ARTBOARD_HORIZONTAL_GUIDE
    }
    mount(){
        const {_rootEl} = this
        const {margin} = this._options;
        const vDiv = document.createElement('div');
        vDiv.setAttribute('style',`cursor:ns-resize;position:absolute;left:0;top:${margin}px;width:${margin}px;bottom:0`)
        this.guideEl = vDiv;
        _rootEl.appendChild(vDiv)
        return this
    }
    onMouseEnter(e:MouseEvent){
        if(super.onMouseEnter(e)) return;
        const {gap,margin,getOffsety} = this._options;
        const y = getOffsety(e.y);
        const curGuide = this.getNewGuide();
        curGuide.className = this._className;
        curGuide.setAttribute('style',this.getGuideStyle(`cursor:ns-resize;left:0;width:100vw;top:${e.y - margin}px;padding-left:${margin + gap}px;padding-top:-${gap}px`))
        curGuide.setAttribute('data-value',y+'');
        this.curGuide = curGuide;
        // this._rootEl.appendChild(this.curGuide);
        this.guideEl.appendChild(this.curGuide);
    }
    onMouseMove(e:MouseEvent){
        if(super.onMouseMove(e)) return;
        const {curGuide} = this;
        const {getOffsety,margin} = this._options;
        if(curGuide == null) return
        const y = getOffsety(e.y);
        curGuide.style.top = `${e.y - margin}px`;
        curGuide.setAttribute('data-value',y+'');
    }
}

export class HGuide extends Guide{
    constructor(protected _rootEl:HTMLElement,options:GuideOptions){
        super(_rootEl,options);
        this._className = ARTBOARD_VERTICAL_GUIDE
    }
    mount(){
        const {_rootEl} = this
        const {margin} = this._options;
        const hDiv = document.createElement('div');
        hDiv.setAttribute('style',`cursor:ew-resize;position:absolute;left:${margin}px;right:0;height:${margin}px;`)
        this.guideEl = hDiv;
        _rootEl.appendChild(hDiv)
        return this
    }
    onMouseEnter(e:MouseEvent){
        if(super.onMouseEnter(e)) return;
        const {gap,margin,getOffsetx} = this._options;
        const x = getOffsetx(e.x);
        const curGuide = this.getNewGuide();
        curGuide.className = this._className;
        curGuide.setAttribute('style',this.getGuideStyle(`cursor:ew-resize;pointer-events:none;top:0;height:100vh;left:${e.x - margin}px;padding-top:${margin + gap}px;padding-left:${gap}px`))
        curGuide.setAttribute('data-value',x+'');
        this.curGuide = curGuide
        // this._rootEl.appendChild(this.curGuide);
        this.guideEl.appendChild(this.curGuide);
    }
    onMouseMove(e:MouseEvent){
        if(super.onMouseMove(e)) return;
        const {curGuide} = this;
        if(curGuide == null) return
        const {getOffsetx,margin} = this._options;
        const x = getOffsetx(e.x);
        curGuide.style.left = `${e.x - margin}px`;
        curGuide.setAttribute('data-value',x+'');
    }
    
}