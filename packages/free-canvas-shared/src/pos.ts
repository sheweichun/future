import {isOverLap} from './utils';

type PosRect = {
    left:number,
    top:number,
    _left:number,
    _top:number,
}

const MINI_NUMBER = 0.0000000001
function fixPercent(percent:number){
    return percent < MINI_NUMBER ? MINI_NUMBER : percent
}

function fixValue(val:number,scale:number=1){
    // return val;
    // return Math.floor(val * scale);
    return val * scale
}

function getRelativeRect(rect:OperationPos,parentRect?:PosRect){
    return {
        left:rect._left  - parentRect._left ,
        top:rect._top  - parentRect._top,
        width:rect._width,
        height:rect._height
    }
    // return new OperationPos(rect.left  - curRect.left,rect.top  - curRect.top,rect.width,rect.height)
}


export function calculateIncludeRect(poses:{left:number,top:number,width:number,height:number}[]){
    const item = poses[0];
    const left = item.left;
    const top = item.top;
    let pos = {
        left,
        top,
        width:item.width,
        height:item.height,
        rightLeft:left + item.width,
        bottomTop:top + item.height
    }
    for(let i = 1; i < poses.length; i++){
        const curItem = poses[i];
        const left = curItem.left;
        const top = curItem.top;
        const rightLeft = left + curItem.width;
        const bottomTop = top + curItem.height;
        const posLeft = pos.left < left ? pos.left : left
        const posTop = pos.top < top ? pos.top : top
        const posWidth = (pos.rightLeft > rightLeft ? pos.rightLeft : rightLeft) - posLeft
        const posHeight = (pos.bottomTop > bottomTop ? pos.bottomTop : bottomTop) - posTop
        pos = {
            left: posLeft,
            top:  posTop,
            width : posWidth,
            height : posHeight,
            rightLeft: posLeft + posWidth,
            bottomTop: posTop + posHeight,
        }
    }
    return pos;
}

export interface IPos{
    left:number,
    top:number,
    width:number,
    height:number
}

export class OperationPos{
    public _left:number
    public _top:number
    public _right:number
    public _bottom:number;

    public right:number
    public bottom:number;
    // public _width:number
    // public _height:number
    constructor(
        public left:number,
        public top:number,
        width:number,
        height:number,
        private _updater?:(pos:OperationPos)=>void){
            this._left = left;
            this._top = top;
            this._right = left + width;
            this._bottom = top + height;
            this.right = this._right;
            this.bottom = this._bottom;
    }
    // scale(scale:number){
    //     const left = fixValue(this.left,scale),
    //     right = fixValue(this.right,scale),
    //     top = fixValue(this.top,scale),
    //     bottom = fixValue(this.bottom,scale);
    //     const pos = new OperationPos(left,top,right - left,bottom - top,this._updater);
    //     pos._left = fixValue(this._left,scale);
    //     pos._right = fixValue(this._right,scale);
    //     pos._top = fixValue(this._top,scale);
    //     pos._bottom = fixValue(this._bottom,scale);
    //     return pos;
    // }
    changeValue(pos:IPos,noUpdate:boolean = false){
        this.left = pos.left;
        this.right = pos.left + pos.width;
        this.top = pos.top;
        this.bottom = pos.top + pos.height;
        (this._updater && !noUpdate) && this._updater(this)
    }
    scaleClone(scale:number){
        const left = fixValue(this.left,scale),
        right = fixValue(this.right,scale),
        top = fixValue(this.top,scale),
        bottom = fixValue(this.bottom,scale);
        const pos = new OperationPos(left,top,right - left,bottom - top,this._updater);
        pos._left = this._left;
        pos._right = this._right;
        pos._top = this._top;
        pos._bottom = this._bottom;
        return pos;
    }
    scale(scale:number){
        // this.left = fixValue(this.left,scale),
        // this.right = fixValue(this.right,scale),
        // this.top = fixValue(this.top,scale),
        // this.bottom = fixValue(this.bottom,scale);
        this.left = fixValue(this.left,scale),
        this.right = fixValue(this.right,scale),
        this.top = fixValue(this.top,scale),
        this.bottom = fixValue(this.bottom,scale);
        return this;
    }
    clone(){
        const {left,top,width,height,_left,_top,_right,_bottom} = this;
        const pos = new OperationPos(left,top,width,height,this._updater);
        pos._left = _left;
        pos._top = _top;
        pos._right = _right;
        pos._bottom = _bottom;
        return pos;
    }
    get _width(){
        return this._right - this._left
    }
    get _height(){
        return this._bottom - this._top
    }
    get width(){
        return this.right - this.left
    }
    get height(){
        return this.bottom - this.top
    }
    set width(wid:number){
        this.right = this.left + wid
    }
    set height(hei:number){
        this.bottom = this.top + hei
    }
    // static EmptyPos = new OperationPos(0,0,0,0);
    static createEmpty(){
        return new OperationPos(0,0,0,0);
    }
    // getDiffX(){
    //     return this.width - this._width
    // }
    // getDiffY(){
    //     return this.height - this._height
    // }
    update(noUpdate?:boolean){
        (this._updater && !noUpdate) && this._updater(this)
        return this;
    }
    include(left:number,top:number){
        return (left > this.left && left - this.left < this.width)
        && (top > this.top && top - this.top < this.height)
    }
    isOverlap(pos:OperationPos){
        // return (this.left + this.width  > pos.left &&
        //     pos.left + pos.width  > this.left &&
        //     this.top + this.height > pos.top &&
        //     pos.top + pos.height > this.top
        //    )
        const {left,top,right,bottom} = this;
        // return (this.right  > pos.left &&
        // pos.right  > this.left &&
        // this.bottom > pos.top &&
        // pos.bottom > this.top
        // )
        return isOverLap(left,top,right,bottom,pos.left,pos.top,pos.right,pos.bottom);
    }
    // isOverlap2(left:number,top:number,right:number,bottom:number){
    //     return (this.right  > left &&
    //         right  > this.left &&
    //         this.bottom > top &&
    //         bottom > this.top
    //        )
    // }
    getHMiddle(){
        return Math.round(this.left + this.width / 2)
    }
    getVMiddle(){
        return Math.round(this.top + this.height / 2)
    }

    moveLeftAndTop_immutation(x:number,y:number){
        // const newPos = this.clone();
        // newPos.moveLeftAndTop(x,y);
        // return newPos;
        const newPos =  new OperationPos(this.left + x,this.top + y,this.width,this.height,this._updater);
        const {_left,_top,_right,_bottom} = this;
        newPos._left = _left;
        newPos._top = _top;
        newPos._right = _right;
        newPos._bottom = _bottom;
        return newPos
    }
    // updateLeftAndTop(x:number,y:number,noUpdate:boolean=false){
    //     this.left = x;
    //     this.top = y;
    //     (this._updater && !noUpdate) && this._updater(this)
    // }
    moveLeftAndTop(x:number,y:number,noUpdate:boolean=false){
        this.left += x;
        this.top += y;
        (this._updater && !noUpdate) && this._updater(this)
        // return new OperationPos(this.left + x,this.top + y,this.width,this.height,this._updater)
        // .update(noUpdate)
    }

    changeLeftAndTop(x:number,y:number,noUpdate:boolean=false){
        this.left = this._left + x;
        this.right = this._right + x;
        this.top = this._top + y;
        this.bottom = this._bottom + y;
        (this._updater && !noUpdate) && this._updater(this)
        // return new OperationPos(this.left + x,this.top + y,this.width,this.height,this._updater)
        // .update(noUpdate)
    }

    moveLeft(diffx:number,diffy:number,noUpdate:boolean=false){
        this.left = this._left + diffx;
        // this.width = this._width - diffx;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveLeftTop(diffx:number,diffy:number,noUpdate:boolean=false){
        this.left = this._left + diffx;
        // this.width = this._width - diffx;
        this.top = this._top + diffy;
        // this.height = this._height - diffy;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveRightTop(diffx:number,diffy:number,noUpdate:boolean=false){
        this.right = this._right + diffx;
        this.top = this._top + diffy;
        // this.height = this._height - diffy;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveLeftBottom(diffx:number,diffy:number,noUpdate:boolean=false){
        this.left = this._left + diffx;
        this.bottom = this._bottom + diffy;
        // this.width = this._width - diffx;
        // this.height = this._height + diffy;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveRightBottom(diffx:number,diffy:number,noUpdate:boolean=false){
        // this.width = this._width + diffx;
        // this.height = this._height + diffy;
        this.right = this._right + diffx;
        this.bottom = this._bottom + diffy;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveRight(diffx:number,diffy:number,noUpdate:boolean=false){
        this.right = this._right + diffx;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveTop(diffx:number,diffy:number,noUpdate:boolean=false){
        this.top = this._top + diffy;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveBottom(diffx:number,diffy:number,noUpdate:boolean=false){
        this.bottom = this._bottom + diffy;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveLeftPercent(pPos:OperationPos,rootPos:OperationPos,noUpdate:boolean=false){
        const xPercent = rootPos.width / rootPos._width;
        const pos = getRelativeRect(this,pPos);
        this.left = fixValue(pPos.left + pos.left * xPercent);
        this.width = fixValue(this._width * xPercent);
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveRightPercent(pPos:OperationPos,rootPos:OperationPos,noUpdate:boolean=false){
        // const xPercent = rootPos.width / rootPos._width;
        // const pos = getRelativeRect(this,pPos);
        // this.left = fixValue(pPos.left + pos.left * xPercent);
        // this.width = fixValue(this._width * xPercent);
        // (this._updater && !noUpdate) && this._updater(this)
        this.moveLeftPercent(pPos,rootPos,noUpdate);
    }
    moveLeftTopPercent(pPos:OperationPos,rootPos:OperationPos,noUpdate:boolean=false){
        const xPercent = rootPos.width / rootPos._width,yPercent = rootPos.height / rootPos._height;
        const pos = getRelativeRect(this,pPos);
        this.left = fixValue(pPos.left + pos.left * xPercent);
        this.width = fixValue(this._width * xPercent);
        this.top = fixValue(pPos.top + pos.top * yPercent);
        this.height = fixValue(this._height * yPercent);
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveLeftBottomPercent(pPos:OperationPos,rootPos:OperationPos,noUpdate:boolean=false){
        this.moveLeftTopPercent(pPos,rootPos,noUpdate);
    }
    moveRightTopPercent(pPos:OperationPos,rootPos:OperationPos,noUpdate:boolean=false){
        this.moveLeftTopPercent(pPos,rootPos,noUpdate);
    }
    moveRightBottomPercent(pPos:OperationPos,rootPos:OperationPos,noUpdate:boolean=false){
        this.moveLeftTopPercent(pPos,rootPos,noUpdate);
    }
    moveTopPercent(pPos:OperationPos,rootPos:OperationPos,noUpdate:boolean=false){
        const yPercent = rootPos.height / rootPos._height;
        const pos = getRelativeRect(this,pPos);
        this.top = fixValue(pPos.top + pos.top * yPercent);
        this.height = fixValue(this._height * yPercent);
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveBottomPercent(pPos:OperationPos,rootPos:OperationPos,noUpdate:boolean=false){
        // const yPercent = rootPos.height / rootPos._height;
        // const pos = getRelativeRect(this,pPos);
        // this.top = fixValue(pPos.top + pos.top * yPercent);
        // this.height = fixValue(this._height * yPercent);
        // (this._updater && !noUpdate) && this._updater(this)
        this.moveTopPercent(pPos,rootPos,noUpdate);
    }
}
