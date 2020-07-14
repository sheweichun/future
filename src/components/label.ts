import {Point,Line} from '../entities/index'
import {ICanvas} from '../core/type';
import {LabelOptions} from './type';
import { completeOptions } from '../utils/index';

const DEFAULT_OPTION = {
    fontSize:10,
    fontStyle:'normal',
    fontWeight:'normal',
    fontFamily:'sans-serif',
    padding:5,
    color:'#333'
}


class VLabel extends Line{
    constructor(public start:Point,public end:Point,options:LabelOptions){
        super(start,end, completeOptions(options,DEFAULT_OPTION));
    }
    draw(drawer:ICanvas):void{
        const {start,_options} = this;
        const {fontSize,fontStyle,color,fontFamily,fontWeight,value,padding} = _options as LabelOptions;
        const {context} = drawer;
        super.draw(drawer);
    }
}

class HLabel extends Line{
    constructor(public start:Point,public end:Point,options:LabelOptions){
        super(start,end,completeOptions(options,DEFAULT_OPTION));
    }
    draw(drawer:ICanvas):void{
        super.draw(drawer);
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