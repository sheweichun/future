
import {Point} from './entity';
import {Line} from './line'
import {ICanvas} from '../core/type';
import {LineMarkOption} from './type';
import { completeOptions } from '../utils';
import {styleSizeHoverColor} from '../utils/constant'

function drawLine(context:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number){
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.closePath(); 
    context.stroke(); 
}

function fillRoundRect(cxt:CanvasRenderingContext2D, x:number, y:number, width:number, height:number, radius:number, /*optional*/ fillColor?:string) {
    //圆的直径必然要小于矩形的宽高       
    const doubleRadius = 2 * radius;   
    if (doubleRadius > width || doubleRadius > height) {
        radius = (width > height ? height : width)
    }

    cxt.save();
    cxt.translate(x, y);
    //绘制圆角矩形的各个边  
    drawRoundRectPath(cxt, width, height, radius);
    cxt.fillStyle = fillColor 
    cxt.fill();
    cxt.restore();
}

function drawRoundRectPath(cxt:CanvasRenderingContext2D, width:number, height:number, radius:number) {
    cxt.beginPath();
    //从右下角顺时针绘制，弧度从0到1/2PI  
    cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

    //矩形下边线  
    cxt.lineTo(radius, height);

    //左下角圆弧，弧度从1/2PI到PI  
    cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

    //矩形左边线  
    cxt.lineTo(0, radius);

    //左上角圆弧，弧度从PI到3/2PI  
    cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

    //上边线  
    cxt.lineTo(width - radius, 0);

    //右上角圆弧  
    cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

    //右边线  
    cxt.lineTo(width, height - radius);
    cxt.closePath();
}

const DEFAULT_OPTION = {
    fontSize:10,
    fontStyle:'normal',
    fontWeight:'normal',
    fontFamily:'sans-serif',
    padding:6,
    margin:5,
    size:5,
    radius:8,
    color:'white',
    lineStyle:styleSizeHoverColor
}

export class LineMark extends Line{
    private _size:number
    private _isVertical:boolean
    private _val:string
    constructor(public start:Point,public end:Point,options?:LineMarkOption){
        super(start,end,completeOptions(options,DEFAULT_OPTION));
        const {size,val} = this._options as LineMarkOption;
        const isVertical = start.x === end.x;
        this._isVertical = isVertical;
        this._size = size;
        this._val = val
    }
    drawPath(context:CanvasRenderingContext2D){
        super.drawPath(context);
        if(this._isVertical){
            this._drawVertical(context)
        }else{
            this._drawHorizontal(context)
        }
       
    }
    private _drawVertical(context:CanvasRenderingContext2D){
        const {start,end,_size} = this;
        drawLine(context,start.x - _size,start.y,start.x + _size,start.y)
        drawLine(context,end.x - _size,end.y,end.x + _size,end.y)
        const diff = end.y - start.y;
        this._drawVerticalVal(context,start.x, start.y + diff / 2);
    }
    private _drawHorizontal(context:CanvasRenderingContext2D){
        const {start,end,_size} = this;
        drawLine(context,start.x,start.y - _size,start.x ,start.y + _size)
        drawLine(context,end.x ,end.y - _size,end.x,end.y  + _size)
        const diff = end.x - start.x;
        this._drawHorizontalVal(context,start.x + diff / 2,start.y);
    }
    private _drawVerticalVal(context:CanvasRenderingContext2D,x:number,y:number){
        const {_val} = this;
        const {fontSize,fontStyle,color,fontFamily,fontWeight,padding,lineStyle,margin,radius} = this._options as LineMarkOption ;
        context.fillStyle = color;
        context.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
        const lineHeight = fontSize * 0.8
        const textWidth = context.measureText(_val).width
        const rectWidth = textWidth + 2 * padding
        const rectHeight = fontSize + padding
        fillRoundRect(context,x - rectWidth - margin ,y - rectHeight/2,rectWidth,rectHeight ,radius,lineStyle);
        context.fillText(_val,x - (margin + padding + textWidth) ,y + lineHeight / 2);
    }
    private _drawHorizontalVal(context:CanvasRenderingContext2D,x:number,y:number){
        const {_val} = this;
        const {fontSize,fontStyle,color,fontFamily,fontWeight,padding,lineStyle,margin,radius} = this._options as LineMarkOption ;
        context.fillStyle = color;
        context.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
        // const lineHeight = fontSize * 1
        const textWidth = context.measureText(_val).width
        const rectWidth = textWidth + 2 * padding
        const rectHeight = fontSize + padding
        fillRoundRect(context,x - rectWidth / 2 ,y  - rectHeight - margin,rectWidth,rectHeight ,radius,lineStyle);
        // context.fillText(_val,x - (margin + padding + textWidth) ,y + lineHeight / 2);
        // context.fillText(_val,x - textWidth / 2 ,y - (margin + padding / 2 + lineHeight));
        context.fillText(_val,x - textWidth / 2 ,y - margin - padding / 2 - 1);
    }
}