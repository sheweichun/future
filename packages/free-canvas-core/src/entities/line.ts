
import {themeConst} from 'free-canvas-theme'
import {Entity,Point} from './entity';
import {ICanvas} from '../core/type';
import {completeOptions,getPropertyValue} from '../utils/index';
import {LineOption} from './type';





const DEFAULT_LINESTYLE = {
    // lineStyle:'#cccccc'
    lineStyle:`var(--${themeConst.TEXT_COLOR_VAR})`
}

export class Line extends Entity{
    protected _options:LineOption
    constructor(public start:Point,public end:Point,options?:LineOption){
        super()
        this._options = completeOptions(options || {},DEFAULT_LINESTYLE);  
        this._options.lineStyle = getPropertyValue(this._options.lineStyle);    
    }
    drawPath(context:CanvasRenderingContext2D){
        const {start,end} = this;
        context.beginPath();
        context.moveTo(start.x ,start.y);
        context.lineTo(end.x ,end.y);
        context.closePath();
        context.stroke(); 
    }
    draw(drawer:ICanvas):void{
        const {context} = drawer;
        const {lineStyle,lineDash} = this._options;
        context.save();
        lineStyle && (context.strokeStyle = lineStyle)
        lineDash && (context.setLineDash(lineDash)) 
        this.drawPath(context)
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