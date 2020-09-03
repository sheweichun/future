
import {ICanvas} from '../core/type';
import {completeOptions} from '../utils/index';
import {Rect} from './rect';
import {RectOption, RectMakerOption} from './type';



const DEFAULT_LINESTYLE = {
    color:'#ccc',
    background:'transparent',
    lineWidth:1,
    fontSize:10,
    fontStyle:'normal',
    fontWeight:'normal',
    fontFamily:'sans-serif',
}

export class RectMark extends Rect{
    protected _options:RectMakerOption
    constructor(_x:number,
        _y:number,
        _width:number,
        _height:number,
        private _val:string,
        options?:RectMakerOption){
        super(_x,_y,_width,_height,options);
        this._options = completeOptions(options || {},DEFAULT_LINESTYLE); 
    }
    drawContent(context:CanvasRenderingContext2D){
        const {_x,_y,_width,_height,_options,_val} = this;
        const {fontStyle,fontWeight,fontSize,fontFamily} = _options
        super.drawContent(context);
        context.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
        const lineHeight = fontSize * 0.8
        const textWidth = context.measureText(_val).width
        context.fillText(_val,_x + (_width - textWidth) / 2  ,_y + (_height - lineHeight) / 2);
    }
}