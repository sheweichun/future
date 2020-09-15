import {Entity,Point,Line,Rect} from '../entities/index'
import {completeOptions} from '../utils/index';
import {createLabel} from './label';
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
    unit:number,
    // unitPerPX:number
}

const DEFAUL_OPTIONS = {
    isVertical:false,
    size:22,
    base:0,
    unit:10
}

abstract class RulerModel{
    protected _unit:number
    protected _baseValue:number
    // protected _unitPerPX:number
    constructor(protected _start:Point,
        protected _end:Point,protected _options:RulerOptions){
            this._unit = _options.unit
            this._baseValue = _options.base
            // this._unitPerPX = _options.unitPerPX
        }
    entities:Entity[]
    abstract initEntities():void
    abstract changeSize(width:number,height:number):void
    changeValue(val:number){
        this._options.base += val;
        this.initEntities();
    }
    setValue(val:number){
        this._options.base = val;
        this.initEntities();
    }
    setValueAndUnit(val:number,unit:number){
        this._options.base = val;
        this._unit = unit;
        // this._unitPerPX = unitPerPX;
        this.initEntities();
    }
}

class VerticalRulerModel extends RulerModel{
    private _base:number

    entities:Entity[]
    constructor(_options:RulerOptions){
        super(_options.start,_options.end,_options);
        this.initEntities();
    }
    changeSize(width:number,height:number){
        // console.log('height :',height,this._end.y);
        this._end = this._end.changeY(height);
        this.initEntities();
    }
    initEntities(){
        const {_options,_start:start,_end:end,_unit:unit} = this;
        const {base,size,backgroundColor,lineOffset} = _options;
        const baseRemain = base % unit;
        const baseDiff = unit - baseRemain;
        // this._base = baseRemain === 0 ? base : (base + diff);
        this._base = baseRemain === 0 ? base : (baseRemain > 0 ? base + baseDiff : base - baseRemain);
        const lineOpt = {
            lineStyle:_options.lineStyle,
        }
        this.entities = [
            // new Line(start.addX(lineOffset),end,lineOpt),
            // new Line(start.addX(size),end.addX(size),lineOpt)
        ]
        const startY = start.y;
        const baseY = startY + (this._base - base);
        for(let y = baseY;  y <= end.y; y += unit ){
            let interval = size - 5, entity:Entity;
            let curVal  = y - baseY + this._base;
            if(curVal % 200 === 0){
                interval = 0;
                entity = createLabel(
                    new Point(start.x + size,y),
                    new Point(start.x + interval,y),
                    {
                        isVertical:true,
                        value:curVal + '',
                        lineStyle:lineOpt.lineStyle
                    }
                )
            }else{
                entity = new Line(
                    new Point(start.x + size,y),
                    new Point(start.x + interval,y),
                    lineOpt
                )
            }
            this.entities.push(entity);
        }
        this.entities.push(new Rect(start.x + lineOffset,start.y,size - lineOffset,end.y - start.y,{
            color:backgroundColor
        }))
    }
}


class HorizontalRulerModel extends RulerModel{
    private _base:number


    entities:Entity[]
    
    constructor(_options:RulerOptions){
        super(_options.start,_options.end,_options);
        this.initEntities();
    }
    changeSize(width:number,height:number){
        this._end = this._end.changeX(width);
        this.initEntities();
    }
    initEntities(){
        const {_options,_start:start,_end:end,_unit:unit} = this;
        const {base,size,backgroundColor,lineOffset} = _options; //base是逻辑像素值
        const baseRemain = base % unit;
        const baseDiff = unit - baseRemain;
        this._base = baseRemain === 0 ? base : (baseRemain > 0 ? base + baseDiff : base - baseRemain);
        const lineOpt = {
            lineStyle:_options.lineStyle
        }
        this.entities = [
            // new Line(start,end,lineOpt),
            // new Line(start.addY(size),end.addY(size),lineOpt),
        ]
        // console.log('start :',start.x,this._base,base);
        const startX = start.x;
        const baseX = startX + (this._base - base); //物理像素值
        for(let x = baseX;  x <= end.x; x += unit ){
            let interval = size - 5,entity:Entity;
            let curVal  = x - baseX + this._base;
            if(curVal % 100 === 0){
                interval = 0;
                entity = createLabel(
                    new Point(x,start.y + size),
                    new Point(x,start.y + interval),
                    {
                        isVertical:false,
                        value:curVal+'',
                        lineStyle:lineOpt.lineStyle
                    }
                )
            }else{ 
                entity = new Line(
                    new Point(x,start.y + size),
                    new Point(x,start.y + interval),
                    lineOpt
                )
            }
            this.entities.push(entity)
        }
        this.entities.push(new Rect(start.x,start.y + lineOffset,end.x - start.x,size - lineOffset,{
            color:backgroundColor
        }))
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
    setValueAndUnit(val:number,unit:number){
        // console.log('unit :',unit);
        this._rulerModel.setValueAndUnit(val,unit);
    }
    draw(drawer:ICanvas):void{
        this._rulerModel.entities.forEach((entity)=>{
            entity.draw(drawer);
        })
    }
}