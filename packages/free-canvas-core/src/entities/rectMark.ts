
import {ICanvas} from '../core/type';
import {themeConst} from 'free-canvas-theme'
import {completeOptions,getPropertyValue} from '../utils/index';
import {Rect} from './rect';
import {RectOption, RectMakerOption} from './type';
import {drawLine,drawTextMarker} from './util'


const DEFAULT_LINESTYLE = {
    color:'#ccc',
    lineWidth:1,
    isVertical:false,
    fontSize:8,
    fontStyle:'normal',
    fontWeight:'normal',
    fontFamily:'sans-serif',
    radius:6,
    intervalLen:2
}

export class RectMark extends Rect{
    protected _options:RectMakerOption
    private _lineStyle:string
    constructor(_x:number,
        _y:number,
        _width:number,
        _height:number,
        private _val:string,
        options?:RectMakerOption){
        super(_x,_y,_width,_height,Object.assign({
            background:getPropertyValue(`var(--${themeConst.CANVAS_MASK_BACKGROUND_VAR})`),
            color:getPropertyValue(`var(--${themeConst.CANVAS_MASK_BACKGROUND_VAR})`)
        },options));
        this._lineStyle = getPropertyValue(`var(--${themeConst.LINE_1_VAR})`);
        this._options = completeOptions(this._options || {},DEFAULT_LINESTYLE); 
    }
    drawContent(context:CanvasRenderingContext2D){
        const {_x,_y,_width,_height,_options} = this;
        const {isVertical,intervalLen,fontStyle,fontWeight,fontSize,fontFamily,radius,showMarker} = _options
        super.drawContent(context);
        context.strokeStyle = this._lineStyle
        const mx = Math.floor(_x + _width / 2);
        const my = Math.floor(_y + _height / 2);
        const x1 = _x + _width;
        const y1 = _y + _height;
        context.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
        const lineHeight = fontSize * 0.8
        if(isVertical){
            drawLine(context,mx,_y,mx,y1);
            drawLine(context,mx - intervalLen,_y,mx  + intervalLen,_y);
            drawLine(context,mx - intervalLen,y1,mx + intervalLen,y1);
            const len = _y - y1;
            showMarker && drawTextMarker(context,len,mx,y1 + (len / 2),{
                lineHeight,
                fontSize,
                radius,
                background:this._lineStyle
            })
        }else{
            drawLine(context,_x,my,x1,my)
            drawLine(context,_x,my - intervalLen,_x,my + intervalLen)
            drawLine(context,x1,my - intervalLen,x1,my + intervalLen)
            const len = _x - x1;
            showMarker && drawTextMarker(context,len,x1 + (len / 2),my,{
                lineHeight,
                fontSize,
                radius,
                background:this._lineStyle
            })
        }
        context.stroke()
       
        
        // const textWidth = context.measureText(_val).width
        // context.fillText(_val,_x + (_width - textWidth) / 2  ,_y + (_height - lineHeight) / 2);
    }
}