import {fromJS,is,List,Map} from 'immutable'
import {ModelVo} from 'free-canvas-shared'
import {HistoryOptions,History} from './history';

// import {Model} from '../model'
import {from,NOT_SET,wrappedValue} from '../cursor/index';
// import {px2Num} from '../../utils/style';
// import { IViewModel } from '../type';


export interface NotRecordData {

}

export interface StoreOption extends HistoryOptions{
    prototype:any,
}



const SPLIT = '.'
export class Store extends History{
    // private _notRecordData:NotRecordData = {}
    private _inTransition:boolean = false
    // private _tmId:number
    private _lastVal:any
    private _lastPreVal:any
    private _lastKeyPath:string[]
    private _norRecord:boolean = false
    // private _selectedKeyPaths:string[] = []
    constructor(data:any,private _opt:StoreOption){
        super(null,_opt);
        //@ts-ignore
        this.onStateChange = this.onStateChange.bind(this);
        this.push(from(fromJS(data),null,_opt.prototype,this.onStateChange))
    }
    getRealRerefFromPath(keyPath:string[],notSetValue?:any){
        const curState = this.currentState;
        const newRootData = curState._deref()
        return newRootData.getIn(keyPath,notSetValue)
    }
    getRealFromPath(keyPath:string[],notSetValue:any){
        const curState = this.currentState;
        const newRootData = curState._deref()
        const val = newRootData.getIn(keyPath,NOT_SET)
        return val === NOT_SET ? notSetValue : wrappedValue(curState, keyPath, val);
    }
    updateData(data:any){
        const {_opt} = this
        this.push(from(fromJS(data),null,_opt.prototype,this.onStateChange))
    }
    // addKeyPath(keyPath:any[]){
    //     this._selectedKeyPaths.push(keyPath.join(SPLIT));
    // }
    // keyPathsIsNotEmpty(){
    //     return this._selectedKeyPaths.length > 0
    // }
    // clearKeyPath(){
    //     this._selectedKeyPaths.splice(0)
    // }
    // removeKeyPath(keyPath:any[]){
    //     const targetIndex = this._selectedKeyPaths.indexOf(keyPath.join(SPLIT));
    //     if(targetIndex >= 0){
    //         this._selectedKeyPaths.splice(targetIndex,1);
    //     }
    //     return this._selectedKeyPaths;
    // }
    // getCurSelectedModel(){
    //     const state = this.currentState.;
    //     return this._selectedKeyPaths.map((keyPath)=>{
    //         return state.getIn(keyPath.split(SPLIT));
    //     })
    // }
    refresh(){
        if(this._lastVal == null) return;
        const currentState = from(this._lastVal,null,this._opt.prototype,this.onStateChange);
        this.currentState._atom_reset();
        this.push(currentState);
        this.clearLastState();
    }
    onStateChange(nextVal:any,preVal:any,keyPath:string[]){
        this._lastVal = nextVal;
        this._lastKeyPath = keyPath;
        this._lastPreVal = preVal;
        if(this._norRecord || this._inTransition) return;
        // if(this._tmId){  //避免连续触发刷新
        //     clearTimeout(this._tmId);
        // }
        // this._tmId = setTimeout(()=>{
        //     this.refresh();
        // })
        this.refresh();
    }
    clearLastState(){
        this._lastKeyPath = null
        this._lastPreVal = null
        this._lastVal = null
    }
    transition(fn:()=>void){
        this._inTransition = true;
        fn();
        this._inTransition = false;
        this.refresh();
    }
    notRecordInHistory(fn:()=>void){
        this._norRecord = true;
        fn();
        this._norRecord = false;
        if(this._lastVal == null) return;
        const newCurrentState = from(this._lastVal,null,this._opt.prototype,this.onStateChange);
        this.currentState._atom_reset();
        this.replace(newCurrentState)
        this.clearLastState();
    }
} 

export const WrapData = fromJS
export const isEqual = is
export const createList = List
export const createMap = Map

export {ImutBase as BaseModel} from 'free-canvas-shared'
// export {Im} from 'free-canvas-shared';
// export {default as BaseModel} from '../cursor/base'