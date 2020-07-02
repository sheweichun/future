import {fromJS,is} from 'immutable'
import {HistoryOptions,History} from './history';
import {from} from './cursor/index';


export interface NotRecordData {

}

export interface StoreOption extends HistoryOptions{
    prototype:any
}


export class Store extends History{
    private _notRecordData:NotRecordData = {}
    constructor(data:any,private _opt:StoreOption){
        super(null,_opt);
        this.onChange = this.onChange.bind(this);
        this.push(from(fromJS(data),null,_opt.prototype,this.onChange))
    }
    onChange(nextVal:any,preVal:any,keyPath:string[]){
        const currentState = from(nextVal,null,this._opt.prototype,this.onChange);
        // const prevState = this.currentState;
        this.push(currentState);
        // this.triggerEvent(currentState,prevState);
    }
} 

export const WrapData = fromJS
export const isEqual = is

export {default as BaseModel} from './cursor/base'