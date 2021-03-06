
import {completeOptions} from '../utils/index';
import {ICanvas,CanvasOption} from './type';

import hidpi,{getRatio} from './hidpi';



const DEFAULT_OPTION:CanvasOption = {

}




export default class Canvas implements ICanvas{
    private _options:CanvasOption;
    private _radio:number;
    context:CanvasRenderingContext2D;
    width:number;
    height:number;
    private _lineOffset:number;
    constructor(private _el:HTMLCanvasElement,option:CanvasOption){
        this._options = completeOptions(option,DEFAULT_OPTION);
        this.context = _el.getContext('2d');
        this.resize();
        this.context.lineWidth = this.getLineWidth();
    }
    getLineWidth(){
        return this.context.lineWidth * this._radio
    }
    getLineOffset(){
        return this._lineOffset;
    }
    clear(){
        this.context.clearRect(0,0,this.width,this.height);
    }
    // initSize(){
    //     const {_el} = this;
    //     const rect = _el.getBoundingClientRect();
    //     this.width = rect.width;
    //     this.height = rect.height;
    //     this._radio = getRatio(this.context);
    //     hidpi(_el,this.width,this.height,this._radio);
    //     this._lineOffset = this._radio % 2 === 1 ? 0.5 : 0;
    // }
    resize(){
        const {_el} = this;
        const target = _el.parentElement;
        const rect = target.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this._radio = getRatio(this.context);
        hidpi(_el,this.width,this.height,this._radio);
        this._lineOffset = this._radio % 2 === 1 ? 0.5 : 0;
    }
}