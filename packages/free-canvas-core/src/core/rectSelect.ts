
import {MoveEvent} from '../events/index';
import {RectSelectOption} from './type';
import {completeOptions} from '../utils/index';
import {MoveEventData} from '../events/type'

const DEFAULT_OPTIONS = {

}

export class RectSelect{
    private _options:RectSelectOption
    private _moveEvent:MoveEvent
    constructor(private _el:HTMLElement,opt:RectSelectOption){
        this._options = completeOptions(opt,DEFAULT_OPTIONS)
        this._moveEvent = new MoveEvent(_el,{
            onMove:this.onMove.bind(this),
            // onStart:this.onStart.bind(this),
            onStop:this.onStop.bind(this)
        })
    }
    listen(){
        this._moveEvent.listen();
    }
    destroy(){
        this._moveEvent.destroy();
    }
    onMove(data:MoveEventData){
        const {updateRectSelect} = this._options
        updateRectSelect(data);
    }
    onStop(data:MoveEventData){
        const {updateRectSelect} = this._options
        updateRectSelect();
    }
}