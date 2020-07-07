import {ICommander,CommanderOption,IViewModel,CommanderCallback} from '../render/type'
import {Store} from '../render/dsl/store';


export class Commander implements ICommander{
    private _map:Map<number,CommanderOption> = new Map()
    constructor(private _store:Store){

    }
    register(name:number,callback: CommanderCallback,context?:any,params?:any[]):void{
        this._map.set(name,{
            callback,
            context,
            params
        })
    }
    unregister(name:number):void{
        this._map.delete(name);
    }
    excute(name:number,vm:IViewModel,data?:any):void{
        const item = this._map.get(name);
        if(item == null) return;
        const {callback,context,params} = item
        callback.apply(context,[vm,...(params || []),data]);
    }
}