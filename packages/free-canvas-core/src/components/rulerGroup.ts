import {DrawEntity,Point} from '../entities/index'
import {completeOptions,controlDelta} from '../utils/index';
import {Ruler} from './ruler';
import {RulerGroupOptions} from './type';
import {ICanvas} from '../core/type';
import {CanvasEvent} from '../events/event';

const DEFAULT_OPTIONS = {
    length:5,
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
        const {lineStyle,length,rulerBackgroundColor} = this._options
        // const halfLineWidth = _drawer.getLineWidth() / 2;
        // const lineWidth = _drawer.getLineWidth();
        const halfLineWidth = 0;
        const lineOffset = _drawer.getLineOffset();
        this._topRuler = new Ruler({
            start:new Point(length-halfLineWidth,halfLineWidth),
            size:length - halfLineWidth * 2,
            backgroundColor:rulerBackgroundColor,
            lineOffset,
            lineStyle:lineStyle,
            end:new Point(_drawer.width,halfLineWidth)
        })
        this._leftRuler = new Ruler({
            isVertical:true,
            start:new Point(halfLineWidth,length-halfLineWidth),
            size:length - halfLineWidth * 2,
            lineStyle:lineStyle,
            lineOffset,
            backgroundColor:rulerBackgroundColor,
            end:new Point(halfLineWidth,_drawer.height)
        })
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
    fireEvent(name:string,e:WheelEvent,repaint:()=>void){
        switch(name){
            case CanvasEvent.MOUSEWHEEL:
                const {wheelSpeedX,wheelSpeedY} = this._options;
                const {deltaX,deltaY} = e;
                this.onMousewheel(controlDelta(deltaX,wheelSpeedX),controlDelta(deltaY,wheelSpeedY),repaint)
        }
    }
    draw(drawer:ICanvas):void{
        this._topRuler.draw(drawer);
        this._leftRuler.draw(drawer);
    }
}