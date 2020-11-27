import {DrawEntity,Point} from '../entities/index'
import {completeOptions} from '../utils/index';
import {Ruler} from './ruler';
import {RulerGroupOptions} from './type';
import {ICanvas} from '../core/type';
import {CanvasEvent} from '../events/event';

const DEFAULT_OPTIONS = {
    length:5,
    // lineStyle:'red',
    // rulerBackgroundColor:'red'
}


export class RulerGroup extends DrawEntity{
    private _topRuler:Ruler
    private _leftRuler:Ruler
    private _options:RulerGroupOptions
    constructor(drawer:ICanvas,options:RulerGroupOptions){
        super(drawer)
        const {_drawer} = this;
        this._options = completeOptions(options,DEFAULT_OPTIONS);
        const {lineStyle,length,rulerBackgroundColor,unit,scale,centerX,centerY} = this._options
        // const halfLineWidth = _drawer.getLineWidth() / 2;
        // const lineWidth = _drawer.getLineWidth();
        const lineOffset = _drawer.getLineOffset();
        // const drawerRatio = _drawer.getRadio();
        // let offset = drawerRatio % 2 === 1 ? 1 : 0
        // offset = 0;
        const ruleSize = Math.round(length * 2 / 3);
        this._topRuler = new Ruler({
            start:new Point(length,0),
            size:ruleSize,
            backgroundColor:rulerBackgroundColor,
            lineOffset,
            centerValue:centerX,
            unit,
            scale,
            base: - this._options.baseX,
            lineStyle:lineStyle,
            end:new Point(_drawer.width,0)
        })
        this._leftRuler = new Ruler({
            isVertical:true,
            base: - this._options.baseY,
            start:new Point(0,length),
            size:ruleSize,
            centerValue:centerY,
            lineStyle:lineStyle,
            lineOffset,
            unit,
            scale,
            backgroundColor:rulerBackgroundColor,
            end:new Point(0,_drawer.height)
        })
    }
    getOffsetx(val:number){
        return this._topRuler.getOffset(val);
    }
    getOffsety(val:number){
        return this._leftRuler.getOffset(val);
    }
    getOffsetByValueX(val:number){
        return this._topRuler.getOffsetByValue(val);
    }
    getOffsetByValueY(val:number){
        return this._topRuler.getOffsetByValue(val);
    }
    changeSize(width:number,height:number){
        this._topRuler.changeSize(width,height)
        this._leftRuler.changeSize(width,height)
    }
    onMousewheel(deltaX:number,deltaY:number,repaint:()=>void){
        let shouldUpdate = false;
        if(deltaX != 0){
            this._topRuler.changeValue(deltaX);
            shouldUpdate = true;
        }
        if(deltaY != 0){
            this._leftRuler.changeValue(deltaY);
            shouldUpdate = true;
        }
        shouldUpdate && repaint();
    }
    setValueAndUnit(x:number,y:number,unit:number,scale:number,centerX:number,centerY:number){
        // const drawerRatio = this._drawer.getRadio();
        // const offset = drawerRatio % 2 === 1 ? 1 : 0
        this._topRuler.setValueAndUnit(-x,unit,scale,centerX);
        this._leftRuler.setValueAndUnit(-y,unit,scale,centerY);
    }
    setNewBaseValue(x:number,y:number){
        // const drawerRatio = this._drawer.getRadio();
        // const offset = drawerRatio % 2 === 1 ? 1 : 0
        this._topRuler.setValue(-x);
        this._leftRuler.setValue(-y);
    }
    fireEvent(name:string,e:WheelEvent,repaint:()=>void){
        switch(name){
            case CanvasEvent.MOUSEWHEEL:
                // const {wheelSpeedX,wheelSpeedY} = this._options;
                const {deltaX,deltaY} = e;
                this.onMousewheel(deltaX,deltaY,repaint)
        }
    }
    draw(drawer:ICanvas):void{
        this._topRuler.draw(drawer);
        this._leftRuler.draw(drawer);
    }
}