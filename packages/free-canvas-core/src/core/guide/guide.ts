
import {CanvasEvent} from 'free-canvas-shared';
import {ARTBOARD_HORIZONTAL_GUIDE,ARTBOARD_VERTICAL_GUIDE} from '../../utils/constant';
import {completeOptions} from '../../utils/index'
import {ContextMenu,ContextMenuData} from '../../components/index'
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
    protected _options:GuideOptions
    protected _contextMenu:ContextMenu
    protected _offset:number
    protected _canvasLeave:boolean = true
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
    abstract onMouseEnter(e:MouseEvent):void
    abstract onMouseMove(e:MouseEvent):void
    // abstract onMouseLeave(e:MouseEvent):void
    addGuide(el:HTMLElement){
        el.style.pointerEvents = 'all';
        // el.add
        this.guideList.push(el);
    }
    onClick(e:MouseEvent):void{
        if(this.curGuide == null) return;
        const newCurGuide = this.curGuide.cloneNode() as HTMLElement;
        // this._rootEl.appendChild(newCurGuide);
        this.guideEl.appendChild(newCurGuide);
        this.addGuide(this.curGuide);
        this.curGuide = newCurGuide;
    }
    onMouseLeave(e?:MouseEvent){
        if(this.curGuide == null || !this._canvasLeave) return
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
    removeAllGuides(){
        this.retrieveGuideList.push(...this.guideList.map((item)=>{
            // this._rootEl.removeChild(item);
            this.guideEl.removeChild(item);
            return item;
        }))
    }
    destroy(){
        const {guideEl} = this
        guideEl.parentNode.removeChild(guideEl);
        guideEl.removeEventListener(CanvasEvent.MOUSEENTER,this.onMouseEnter)
        guideEl.removeEventListener(CanvasEvent.MOUSEMOVE,this.onMouseMove)
        guideEl.removeEventListener(CanvasEvent.MOUSELEAVE,this.onMouseLeave)
        guideEl.removeEventListener(CanvasEvent.CLICK,this.onClick)
        this._contextMenu.destroy()
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
        this._canvasLeave = false;
        const menuList:ContextMenuData[] = [
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
        return menuList
    }
    hideMenu(){
        this._canvasLeave = true;
        this.onMouseLeave();
    }
    abstract mount(el:HTMLElement):void
    listen(){
        const {guideEl} = this
        this._contextMenu = new ContextMenu({
            getMenuData:this.getMenuData,
            onHide:this.hideMenu
        }).bind(guideEl);
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
        const {gap,margin,getOffsety} = this._options;
        const y = getOffsety(e.y);
        const curGuide = this.getNewGuide();
        curGuide.className = this._className;
        curGuide.setAttribute('style',`cursor:ns-resize;left:0;width:100vw;top:${e.y - margin}px;padding-left:${margin + gap}px;padding-top:-${gap}px`)
        curGuide.setAttribute('data-value',y+'');
        this.curGuide = curGuide;
        // this._rootEl.appendChild(this.curGuide);
        this.guideEl.appendChild(this.curGuide);
    }
    onMouseMove(e:MouseEvent){
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
        const {gap,margin,getOffsetx} = this._options;
        const x = getOffsetx(e.x);
        const curGuide = this.getNewGuide();
        curGuide.className = this._className;
        curGuide.setAttribute('style',`cursor:ew-resize;pointer-events:none;top:0;height:100vh;left:${e.x - margin}px;padding-top:${margin + gap}px;padding-left:${gap}px`)
        curGuide.setAttribute('data-value',x+'');
        this.curGuide = curGuide
        // this._rootEl.appendChild(this.curGuide);
        this.guideEl.appendChild(this.curGuide);
    }
    onMouseMove(e:MouseEvent){
        const {curGuide} = this;
        if(curGuide == null) return
        const {getOffsetx,margin} = this._options;
        const x = getOffsetx(e.x);
        curGuide.style.left = `${e.x - margin}px`;
        curGuide.setAttribute('data-value',x+'');
    }
    
}