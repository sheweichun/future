
import {Entity} from './entity';
import {ICanvas} from '../core/type';
import {completeOptions} from '../utils/index';
import {RectOption} from './type';



const DEFAULT_LINESTYLE = {
    color:'white'
}

export class Rect extends Entity{
    protected _options:RectOption
    constructor(options?:RectOption){
        super()
        this._options = completeOptions(options || {},DEFAULT_LINESTYLE);        
    }
    draw(drawer:ICanvas):void{
        const {context} = drawer;
        const {x,y,width,height,color} = this._options;
        context.save();
        context.fillStyle = color;
        context.fillRect(x,y,width,height);
        context.restore();
    }
}