

type PosRect = {
    _left:number,
    _top:number,
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

export class OperationPos{
    public _left:number
    public _top:number
    public _width:number
    public _height:number
    constructor(
        public left:number,
        public top:number,
        public width:number,
        public height:number,
        private _updater?:(pos:OperationPos)=>void){
            this._left = left;
            this._top = top;
            this._width = width;
            this._height = height;
    }
    update(noUpdate:boolean){
        (this._updater && !noUpdate) && this._updater(this)
        return this;
    }
    include(left:number,top:number){
        return (left > this.left && left - this.left < this.width)
        && (top > this.top && top - this.top < this.height)
    }
    isOverlap(pos:OperationPos){
        return (this.left + this.width  > pos.left &&
            pos.left + pos.width  > this.left &&
            this.top + this.height > pos.top &&
            pos.top + pos.height > this.top
           )
    }
    getHMiddle(){
        return Math.floor(this.left + this.width / 2)
    }
    getVMiddle(){
        return Math.floor(this.top + this.height / 2)
    }
    moveLeftAndTop_immutation(x:number,y:number){
        return new OperationPos(this.left + x,this.top + y,this.width,this.height,this._updater);
    }
    moveLeftAndTop(x:number,y:number,noUpdate:boolean=false){
        // this.left += x;
        // this.top += y;
        // (this._updater && !noUpdate) && this._updater(this)
        return new OperationPos(this.left + x,this.top + y,this.width,this.height,this._updater)
        .update(noUpdate)
    }
    moveLeft(diffx:number,diffy:number,noUpdate:boolean=false){
        this.left = this._left + diffx;
        this.width = this._width - diffx;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveRight(diffx:number,diffy:number,noUpdate:boolean=false){
        this.width = this._width + diffx;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveTop(diffx:number,diffy:number,noUpdate:boolean=false){
        this.top = this._top + diffy;
        this.height = this._height - diffy;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveBottom(diffx:number,diffy:number,noUpdate:boolean=false){
        this.height = this._height + diffy;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveLeftPercent(pPos:PosRect,xPercent:number,yPercent:number,noUpdate:boolean=false){
        const pos = getRelativeRect(this,pPos);
        this.left = pPos._left + pos.left * xPercent;
        this.width = this._width * xPercent;
        (this._updater && !noUpdate) && this._updater(this)
        // console.log('pPos.left :',pPos.left,pos.left,xPercent,pPos.left + pos.left * xPercent);
        // return new OperationPos(pPos.left + pos.left * xPercent,this.top,this.width * xPercent,this.height,this._updater)
        // .update(noUpdate)
    }
    moveRightPercent(pPos:PosRect,xPercent:number,yPercent:number,noUpdate:boolean=false){
        return this.moveLeftPercent(pPos,xPercent,yPercent,noUpdate)
        // this.moveLeftPercent(diffx,diffy,noUpdate);
        // (this._updater && !noUpdate) && this._updater(this)
    }
    moveTopPercent(diffx:number,diffy:number,noUpdate:boolean=false){
        this.top = Math.floor(this.top * diffy);
        this.height = Math.floor(this.height * diffy);
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveBottomPercent(diffx:number,diffy:number,noUpdate:boolean=false){
        this.moveTopPercent(diffx,diffy,noUpdate);
    }

    // moveLeft(diffx:number,diffy:number,noUpdate:boolean=false){
    //     // this.left += diffx;
    //     // this.width -= diffx;
    //     // (this._updater && !noUpdate) && this._updater(this)
    //     return new OperationPos(this.left + diffx,this.top,this.width - diffx,this.height,this._updater)
    //     .update(noUpdate);
    // }
    // moveRight(diffx:number,diffy:number,noUpdate:boolean=false){
    //     // this.width += diffx;
    //     // (this._updater && !noUpdate) && this._updater(this)
    //     return new OperationPos(this.left,this.top,this.width + diffx,this.height,this._updater)
    //     .update(noUpdate);
    // }
    // moveTop(diffx:number,diffy:number,noUpdate:boolean=false){
    //     // this.top += diffy;
    //     // this.height -= diffy;
    //     // (this._updater && !noUpdate) && this._updater(this)
    //     return new OperationPos(this.left,this.top + diffy,this.width,this.height - diffy,this._updater)
    //     .update(noUpdate);
    // }
    // moveBottom(diffx:number,diffy:number,noUpdate:boolean=false){
    //     // this.height += diffy;
    //     // (this._updater && !noUpdate) && this._updater(this)
    //     return new OperationPos(this.left,this.top,this.width,this.height + diffy,this._updater)
    //     .update(noUpdate);
    // }
    // moveByPercent(xPercent:number,yPercent:number,noUpdate:boolean=false){
    //     console.log(xPercent,yPercent);
    //     // const totalXPercent = 1 + xPercent,totalYPercent = 1 + yPercent;
    //     this.left *= xPercent;
    //     this.width *= xPercent;
    //     this.top *= yPercent;
    //     this.height *= yPercent;
    //     (this._updater && !noUpdate) && this._updater(this)
    // }
}

// moveByPercent(parentWidth:number,parentNewWidth:number,parentHeight:number,parentNewHeight:number,noUpdate:boolean=false){
//     const xPercent = parentNewWidth / parentWidth,yPercent = parentNewHeight / parentHeight;
//     this.left *= totalXPercent;
//     this.width *= totalXPercent;
//     this.top *= totalYPercent;
//     this.height *= totalYPercent;
//     (this._updater && !noUpdate) && this._updater(this)
// }


    // moveLeftPercent(pPos:PosRect,pos:PosRect,xPercent:number,yPercent:number,noUpdate:boolean=false){
    //     // // const originLeft = this.left;
    //     // console.log('xpercent :',xPercent);
    //     // this.left = Math.floor(pPos.left + pos.left * xPercent);
    //     // this.width *= xPercent;
    //     // console.log('pPos.left :',pPos.left,pos.left,xPercent,pPos.left + pos.left * xPercent);
    //     return new OperationPos(pPos.left + pos.left * xPercent,this.top,this.width * xPercent,this.height,this._updater)
    //     .update(noUpdate)
    // }
    // moveRightPercent(pPos:PosRect,pos:PosRect,xPercent:number,yPercent:number,noUpdate:boolean=false){
    //     return this.moveLeftPercent(pPos,pos,xPercent,yPercent,noUpdate)
    //     // this.moveLeftPercent(diffx,diffy,noUpdate);
    //     // (this._updater && !noUpdate) && this._updater(this)
    // }
    // moveTopPercent(diffx:number,diffy:number,noUpdate:boolean=false){
    //     this.top = Math.floor(this.top * diffy);
    //     this.height = Math.floor(this.height * diffy);
    //     (this._updater && !noUpdate) && this._updater(this)
    // }
    // moveBottomPercent(diffx:number,diffy:number,noUpdate:boolean=false){
    //     this.moveTopPercent(diffx,diffy,noUpdate);
    // }