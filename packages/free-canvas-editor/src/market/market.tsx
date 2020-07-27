import {IPlugin,ICommander,ImutBase, COMMANDERS} from 'free-canvas-shared'  
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Button} from '@alife/next';

export class Market implements IPlugin{
    private _commander:ICommander
    constructor(private _el:HTMLElement){
        this.mount();
    }
    install(commander:ICommander){
        this._commander = commander;
    }
    update(data:ImutBase,selectNodes:ImutBase[]):void{

    }
    destroy(){

    }
    onAdd=()=>{
        this._commander.excute(COMMANDERS.ADD,{
            id:'114',
            name:'div',
            style:{
                width:'150px',
                height:'150px',
                backgroundColor:'pink'
            },
            extra:{
                position:{
                    left:1200,
                    top:200
                }
            }
        })
    }
    mount(){
        ReactDOM.render(<div>
            in react aside
            <Button type="primary" onClick={this.onAdd}>add view</Button>
        </div>,this._el);
    }
}