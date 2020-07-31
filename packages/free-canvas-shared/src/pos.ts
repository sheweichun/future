



export class OperationPos{
    constructor(
        public left:number,
        public top:number,
        public width:number,
        public height:number,
        private _updater?:(pos:OperationPos)=>void){

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
        this.left += x;
        this.top += y;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveLeft(diffx:number,diffy:number,noUpdate:boolean=false){
        this.left += diffx;
        this.width -= diffx;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveRight(diffx:number,diffy:number,noUpdate:boolean=false){
        this.width += diffx;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveTop(diffx:number,diffy:number,noUpdate:boolean=false){
        this.top += diffy;
        this.height -= diffy;
        (this._updater && !noUpdate) && this._updater(this)
    }
    moveBottom(diffx:number,diffy:number,noUpdate:boolean=false){
        this.height += diffy;
        (this._updater && !noUpdate) && this._updater(this)
    }
}