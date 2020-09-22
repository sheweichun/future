import {Entity,Point,Line,Rect} from '../entities/index'
import {completeOptions} from '../utils/index';
import {createLabel} from './label';
import {LabelOptions} from './type'
import {ICanvas} from '../core/type';

export interface RulerOptions{
    isVertical?:boolean,
    backgroundColor?:string
    start:Point, //起点坐标
    end:Point,
    lineOffset:number,
    lineStyle:string,
    base?:number, // 起点值
    size?:number,
    centerValue:number,
    scale:number,
    unit:number,
    // unitPerPX:number
}

const DEFAUL_OPTIONS = {
    isVertical:false,
    size:22,
    base:0,
    unit:10
}


// function getIntervalValue(total:number,num:number = 25){
//     const divider = total / num;
//     if(divider > 160){
//         return 200
//     }else if(divider > 80){
//         return 100
//     }else if(divider > 40){
//         return 50;
//     }
//     return 20;
// }

function getIntervalValue(scale:number,num:number = 25){
    if(scale < 0.8){
        return 200
    }else if(scale < 1.4){
        return 100
    }else if(scale < 3){
        return 50;
    }
    return 20;
}

abstract class RulerModel{
    protected _unit:number
    protected _baseValue:number
    protected _scaleBaseValue:number
    protected _interval:number = 5
    protected _scale:number
    protected _isVertical:boolean
    protected _centerValue:number
    // protected _unitPerPX:number
    constructor(protected _start:Point,
        protected _end:Point,protected _options:RulerOptions){
            this._unit = _options.unit
            this._baseValue = _options.base
            this._scale = _options.scale
            this._centerValue = _options.centerValue
            // this.updateScaleBaseValue();
            // this._unitPerPX = _options.unitPerPX
        }
    entities:Entity[]
    abstract createEntities():void
    abstract changeSize(width:number,height:number):void
    abstract createLabel(tickValue:number,value:number):Line
    abstract createLine(value:number):Line
    abstract createRect():Rect
    changeValue(val:number){
        this._baseValue += val;
        this._centerValue -= val;
        this.createEntities();
    }
    setValue(val:number){
        this._baseValue = val;
        this.createEntities();
    }
    setValueAndUnit(val:number,unit:number,scale:number,centerValue:number){
        this._baseValue = val;
        this._unit = unit;
        this._scale = scale;
        this._centerValue = centerValue;
        this.createEntities();
    }
    getOffset(val:number){
        const {_scale,_scaleBaseValue} = this;
        const valuePerPX = 1 / _scale;
        const retValue = Math.round(val * valuePerPX + _scaleBaseValue)
        return {
            value:retValue,
            offset: (retValue - _scaleBaseValue ) / valuePerPX
        }
    }
    createEntitiesByVal(start:number,end:number){
        const {_unit:unit,_baseValue,_scale,_centerValue} = this;
        // const tickTotal = end - start;
        // const totalValue = tickTotal / _scale;
        const intervalValue = getIntervalValue(_scale);
        const unitValue = intervalValue / unit;
        // console.log('intervalValue :',Math.round(totalValue),intervalValue,unitValue);
        const valuePerPX = 1 / _scale;
        const base = _baseValue + (_scale - 1) * (_centerValue) * valuePerPX;
        this._scaleBaseValue = base;
    
        // const totalValue = tickTotal * _scale;


        const baseRemain = base % unitValue;
        const baseDiff = unitValue - baseRemain;
        const realBase = baseRemain === 0 ? base : (baseRemain > 0 ? base + baseDiff : base - baseRemain);
        

        this.entities = []

        let pxValue:number,displayValue:number
        for(let value = realBase; ;value += unitValue ){
            let entity:Entity;
            pxValue = start + (value - base) / valuePerPX;
            displayValue = Math.round(pxValue);
            if(value % intervalValue === 0){
                entity = this.createLabel(value,displayValue);
            }else{
                entity = this.createLine(displayValue);
            }
            this.entities.push(entity);
            if(pxValue > end) break;
        }

    }
}

class VerticalRulerModel extends RulerModel{

    entities:Entity[]
    constructor(_options:RulerOptions){
        super(_options.start,_options.end,_options);
        this._isVertical = true;
        this.createEntities();
    }
    changeSize(width:number,height:number){
        this._end = this._end.changeY(height);
        this.createEntities();
    }
    createEntities(){
        const {_start,_end} = this;
        this.createEntitiesByVal(_start.y,_end.y);
    }
    createRect(){
        const {_options,_start:start,_end:end} = this;
        const {backgroundColor,size,lineOffset} = _options;
        return new Rect(start.x + lineOffset,start.y,size - lineOffset,end.y - start.y,{
            color:backgroundColor
        })
    }
    createLine(value:number):Line{
        const {_options,_start:start,_interval} = this;
        const {lineStyle} = _options;
        return new Line(
            new Point(start.x,value),
            new Point(start.x + _interval,value),
            {
                lineStyle
            }
        )
    }
    createLabel(tickValue:number,value:number):Line{
        const {_options,_start:start} = this;
        const {lineStyle,size} = _options;
        return createLabel(
            new Point(start.x + size ,value),
            new Point(start.x ,value),
            {
                isVertical:true,
                value:tickValue + '',
                padding:2,
                lineStyle
            }
        )
    }
}


class HorizontalRulerModel extends RulerModel{


    entities:Entity[]
    
    constructor(_options:RulerOptions){
        super(_options.start,_options.end,_options);
        this._isVertical = false;
        this.createEntities();
    }
    changeSize(width:number,height:number){
        this._end = this._end.changeX(width);
        this.createEntities();
    }
    createEntities(){
        const {_start,_end} = this;
        this.createEntitiesByVal(_start.x,_end.x);
    }
    createRect(){
        const {_options,_start:start,_end:end} = this;
        const {backgroundColor,size,lineOffset} = _options;
        return new Rect(start.x,start.y + lineOffset,end.x - start.x,size - lineOffset,{
            color:backgroundColor
        })
    }
    createLine(value:number):Line{
        const {_options,_start:start,_interval} = this;
        const {lineStyle} = _options;
        return new Line(
            new Point(value, start.y),
            new Point(value, start.y + _interval),
            {
                lineStyle
            }
        )
    }
    createLabel(tickValue:number,value:number):Line{
        const {_options,_start:start} = this;
        const {lineStyle,size} = _options;
        return createLabel(
            new Point(value ,start.y),
            new Point(value ,start.y + size),
            {
                isVertical:false,
                value:tickValue + '',
                lineStyle
            }
        )
    }
}

function createRulerModel(options:RulerOptions):RulerModel{
    if(options.isVertical){
        return new VerticalRulerModel(options)
    }
    return new HorizontalRulerModel(options);
}


export class Ruler extends Entity{
    private _rulerModel:RulerModel
    constructor(options:RulerOptions){
        super();
        this._rulerModel = createRulerModel(completeOptions(options,DEFAUL_OPTIONS));

    }
    changeSize(width:number,height:number){
        this._rulerModel.changeSize(width,height);
    }
    changeValue(val:number){
        this._rulerModel.changeValue(val);
    }
    setValue(val:number){
        this._rulerModel.setValue(val);
    }
    getOffset(val:number){
        return this._rulerModel.getOffset(val)
    }
    setValueAndUnit(val:number,unit:number,scale:number,centerValue:number){
        this._rulerModel.setValueAndUnit(val,unit,scale,centerValue);
    }
    draw(drawer:ICanvas):void{
        this._rulerModel.entities.forEach((entity)=>{
            entity.draw(drawer);
        })
    }
}