import {themeConst} from 'free-canvas-theme'
import {Point,Line} from '../entities/index'
import {ICanvas} from '../core/type';
import {LabelOptions} from './type';
import { completeOptions ,getPropertyValue} from '../utils/index';

const DEFAULT_OPTION = {
    fontSize:10,
    fontStyle:'normal',
    fontWeight:'normal',
    fontFamily:'sans-serif',
    padding:5,
    color:`var(--${themeConst.TEXT_COLOR_VAR})`
}


class VLabel extends Line{
    constructor(public start:Point,public end:Point,options:LabelOptions){
        super(start,end, completeOptions(options,DEFAULT_OPTION));
        const opt = this._options as LabelOptions;
        opt.color = getPropertyValue(opt.color)
    }
    draw(drawer:ICanvas):void{
        const {start,end,_options} = this;
        const {fontSize,fontStyle,color,fontFamily,fontWeight,value,padding} = _options as LabelOptions;
        const {context} = drawer;
        const textX = start.x - padding * 2,textY = end.y - padding
        super.draw(drawer);
        context.save();
        context.translate(textX,textY);
        context.rotate(-Math.PI / 180 * 90);
        context.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
        context.fillStyle = color;
        context.fillText(value,0,0);
        context.restore();
    }
}

class HLabel extends Line{
    constructor(public start:Point,public end:Point,options:LabelOptions){
        super(start,end,completeOptions(options,DEFAULT_OPTION));
        const opt = this._options as LabelOptions;
        opt.color = getPropertyValue(opt.color)
    }
    draw(drawer:ICanvas):void{
        const {start,end,_options} = this;
        const {fontSize,fontStyle,color,fontFamily,fontWeight,value,padding} = _options as LabelOptions;
        const {context} = drawer;
        super.draw(drawer);
        context.save();
        context.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
        context.fillStyle = color;
        context.fillText(value,start.x + padding,end.y + padding * 2);
        context.restore();
    }
}




export function createLabel(start:Point,end:Point,options:LabelOptions):Line{
    if(options.isVertical){
        return new VLabel(start,end,options);
    }
    return new HLabel(start,end,options);
}