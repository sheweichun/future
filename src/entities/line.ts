
import {Entity,Point} from './entity';
import {ICanvas} from '../core/type';
import {completeOptions} from '../utils/index';
import {LineOption} from './type';



const DEFAULT_LINESTYLE = {
    lineStyle:'#cccccc'
}

export class Line extends Entity{
    protected _options:LineOption
    constructor(public start:Point,public end:Point,options?:LineOption){
        super()
        this._options = completeOptions(options || {},DEFAULT_LINESTYLE);        
    }
    draw(drawer:ICanvas):void{
        const {context} = drawer;
        const {start,end,_options} = this;
        context.save();
        _options.lineStyle && (context.strokeStyle = _options.lineStyle)
        context.beginPath();
        context.moveTo(start.x,start.y);
        context.lineTo(end.x,end.y);
        context.stroke(); 
        context.restore();
    }
    changeX(x:number){
        const {start ,end} = this;
        start.x += x;
        end.x += x;
    }
    changeY(y:number){
        const {start ,end} = this;
        start.y += y;
        end.y += y;
    }
}