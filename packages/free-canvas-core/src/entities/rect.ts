
import {Entity} from './entity';
import {ICanvas} from '../core/type';
import {completeOptions} from '../utils/index';
import {RectOption} from './type';



const DEFAULT_LINESTYLE = {
    color:'#ccc',
    background:'transparent',
    lineWidth:1
}

export class Rect extends Entity{
    protected _options:RectOption
    constructor(protected _x:number,
        protected _y:number,
        protected _width:number,
        protected _height:number,
        options?:RectOption){
        super()
        this._options = completeOptions(options || {},DEFAULT_LINESTYLE);        
    }
    update(x:number,y:number,width:number,height:number){
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }
    drawContent(context:CanvasRenderingContext2D){
        const {_x,_y,_width,_height} = this;
        const {color,background} = this._options;
        context.fillStyle = background;
        context.strokeStyle = color
        context.fillRect(_x,_y,_width,_height); 
        context.strokeRect(_x,_y,_width,_height);
    }
    draw(drawer:ICanvas):void{
        const {context} = drawer;
        context.save();
        this.drawContent(context)
        context.restore();
    }
}