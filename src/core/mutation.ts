
import {Store,WrapData, BaseModel} from '../render/index'
import {Commander} from './commander'
import { COMMANDERS, IViewModel } from "../render/type";
import {isEqual} from '../render/dsl/store'

const SPLIT = '.'



export class Mutation{
    constructor(private _store:Store,private _commander:Commander){
    }
    register(){
        this._commander.register(COMMANDERS.POSITIONCHANGE,this.onPostionChange,this);
        this._commander.register(COMMANDERS.SELECTED,this.onSelected,this);
        this._commander.register(COMMANDERS.UNSELECTED,this.onUnSelected,this);
    }
    removeSelectedKeyPath(keyPath:any[]){

    }
    getSelected(){

    }
    notRecord(fn:(store:Store)=>void){
        this._store.notRecordInHistory(()=>{
            fn(this._store)
        })
    }
    transition(fn:(store:Store)=>void){
        this._store.transition(()=>{
            fn(this._store)
        })
    }
    each(curModel:BaseModel,fn:(item:BaseModel)=>boolean){
        const ret = fn(curModel);
        if(!ret) return;
        const children = curModel.get('children',null);
        if(children){
            children.forEach((child:BaseModel)=>{
                this.each(child,fn);
            })
        }
    }
    onPostionChange(vm:IViewModel,data:{left:number,top:number}){
        vm.getModel().updateIn(['extra','position'],null,()=>{
            return WrapData(data)
        })
    }
    onUnSelected(){
        this.notRecord((store)=>{
            this.each(store.currentState,(curModel:BaseModel)=>{
                if(curModel.getIn(['extra','isSelect'],false)){
                    curModel.updateIn(['extra','isSelect'],null,()=>false)
                    return true;
                }
                return true;
            })
        })
        this._store.clearKeyPath();
    }
    onSelected(vm:IViewModel,needKeep:boolean){
        this.notRecord((store)=>{
            const target = vm.getModel();
            this.each(store.currentState,(curModel:BaseModel)=>{
                const isSelected = curModel.getIn(['extra','isSelect'],false)
                if(isEqual(curModel,target)){
                    if(isSelected && needKeep && this._store.keyPathsIsNotEmpty()){
                        this._store.removeKeyPath(curModel._keyPath);
                        curModel.updateIn(['extra','isSelect'],null,()=>false)
                    }else{
                        this._store.addKeyPath(curModel._keyPath);
                        curModel.updateIn(['extra','isSelect'],null,()=>true)
                    }
                }else if(!needKeep && isSelected){
                    this._store.removeKeyPath(curModel._keyPath);
                    curModel.updateIn(['extra','isSelect'],null,()=>false)
                }
                return true;
            })
        })
    }
}