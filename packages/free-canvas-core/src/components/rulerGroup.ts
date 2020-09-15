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
        const {lineStyle,length,rulerBackgroundColor,unit} = this._options
        // const halfLineWidth = _drawer.getLineWidth() / 2;
        // const lineWidth = _drawer.getLineWidth();
        const halfLineWidth = 0;
        const lineOffset = _drawer.getLineOffset();
        this._topRuler = new Ruler({
            start:new Point(length-halfLineWidth,halfLineWidth),
            size:length - halfLineWidth * 2,
            backgroundColor:rulerBackgroundColor,
            lineOffset,
            unit,
            base: - this._options.baseX,
            lineStyle:lineStyle,
            end:new Point(_drawer.width,halfLineWidth)
        })
        this._leftRuler = new Ruler({
            isVertical:true,
            base: - this._options.baseY,
            start:new Point(halfLineWidth,length-halfLineWidth),
            size:length - halfLineWidth * 2,
            lineStyle:lineStyle,
            lineOffset,
            unit,
            backgroundColor:rulerBackgroundColor,
            end:new Point(halfLineWidth,_drawer.height)
        })
    }
    changeSize(width:number,height:number){
        this._topRuler.changeSize(width,height)
        this._leftRuler.changeSize(width,height)
    }
    onMousewheel(deltaX:number,deltaY:number,repaint:()=>void){
        // console.log('onMousewheel :',deltaX,deltaY);
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
    setValueAndUnit(x:number,y:number,unit:number){
        this._topRuler.setValueAndUnit(-x,unit);
        this._leftRuler.setValueAndUnit(-y,unit);
    }
    setNewBaseValue(x:number,y:number){
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