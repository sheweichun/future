import {Entity,Point,Line,Rect} from '../entities/index'
import {completeOptions} from '../utils/index';
import {createLabel} from './label';
import {ICanvas} from '../core/type';

export interface RulerOptions{
    isVertical?:boolean,
    backgroundColor?:string
    start:Point, //起点坐标
    end:Point,
    lineStyle:string,
    base?:number, // 起点值
    size?:number,
    unit?:number,
}

const DEFAUL_OPTIONS = {
    isVertical:false,
    size:22,
    base:0,
    unit:10
}

abstract class RulerModel{
    entities:Entity[]
    protected _options:RulerOptions
    abstract initEntities():void
    changeValue(val:number){
        this._options.base += val;
        this.initEntities();
    }

}

class VerticalRulerModel extends RulerModel{
    private _base:number

    entities:Entity[]
    constructor(protected _options:RulerOptions){
        super();
        this.initEntities();
    }
    initEntities(){
        const {_options} = this;
        const {start,end,base,size,unit,backgroundColor} = _options;
        const baseRemain = base % unit;
        const baseDiff = unit - baseRemain;
        // this._base = baseRemain === 0 ? base : (base + diff);
        this._base = baseRemain === 0 ? base : (baseRemain > 0 ? base + baseDiff : base - baseRemain);
        const lineOpt = {
            lineStyle:_options.lineStyle,
        }
        this.entities = [
            new Line(start,end,lineOpt),
            new Line(start.addX(size),end.addX(size),lineOpt),
            new Rect(start.x,start.y,size,end.y - start.y,{
                color:backgroundColor
            })
        ]
        const startY = start.y;
        const baseY = startY + (this._base - base);
        for(let y = baseY;  y <= end.y; y += unit){
            let interval = size - 5, entity:Entity;
            let curVal  = y - baseY + this._base;
            if(curVal % 200 === 0){
                interval = 0;
                entity = createLabel(
                    new Point(start.x + size,y),
                    new Point(start.x + interval,y),
                    {
                        isVertical:false,
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
    }
}


class HorizontalRulerModel extends RulerModel{
    private _base:number


    entities:Entity[]
    
    constructor(protected _options:RulerOptions){
        super();
        this.initEntities();
    }
    initEntities(){
        const {_options} = this;
        const {start,end,base,size,unit,backgroundColor} = _options;
        const baseRemain = base % unit;
        const baseDiff = unit - baseRemain;
        this._base = baseRemain === 0 ? base : (baseRemain > 0 ? base + baseDiff : base - baseRemain);
        const lineOpt = {
            lineStyle:_options.lineStyle
        }
        this.entities = [
            new Line(start,end,lineOpt),
            new Line(start.addY(size),end.addY(size),lineOpt),
            new Rect(start.x,start.y,end.x - start.x,size,{
                color:backgroundColor
            })
        ]
        const startX = start.x;
        const baseX = startX + (this._base - base);
        for(let x = baseX;  x <= end.x; x += unit){
            let interval = size - 5,entity:Entity;
            let curVal  = x - baseX + this._base;
            if(curVal % 200 === 0){
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
    changeValue(val:number){
        this._rulerModel.changeValue(val);
    }
    draw(drawer:ICanvas):void{
        this._rulerModel.entities.forEach((entity)=>{
            entity.draw(drawer);
        })
    }
}