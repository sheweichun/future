import {fromJS,is} from 'immutable'
import {HistoryOptions,History} from './history';
import {Model} from '../model'
import {from} from './cursor/index';
import {px2Num} from '../../utils/style';


export interface NotRecordData {

}

export interface StoreOption extends HistoryOptions{
    prototype:any
}


function completeData(data:Model){
    if(data == null) return;
    data.extra = data.extra || {isSelect:false}
    if(!data.extra.position){
        data.extra.position = {}
    }
    data.children && data.children.forEach((child)=>{
        completeData(child)
    })
    return data;
}


export class Store extends History{
    private _notRecordData:NotRecordData = {}
    constructor(data:Model,private _opt:StoreOption){
        super(null,_opt);
        this.onChange = this.onChange.bind(this);
        this.push(from(fromJS(completeData(data)),null,_opt.prototype,this.onChange))
    }
    onChange(nextVal:any,preVal:any,keyPath:string[]){
        const currentState = from(nextVal,null,this._opt.prototype,this.onChange);
        this.push(currentState);
    }
} 

export const WrapData = fromJS
export const isEqual = is

export {default as BaseModel} from './cursor/base'