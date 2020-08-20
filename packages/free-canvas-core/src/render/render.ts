import {completeOptions} from '../utils/index'
import {RenderOptions} from './type';
const DEFAULT_OPTIONS = {

}

export class Render{
    private _options:RenderOptions
    constructor(public el:HTMLElement,options:RenderOptions){
        this._options = completeOptions(options,DEFAULT_OPTIONS);
    }
}