
import * as React from 'react';
// import {Model} from 'free-canvas-shared'
import {DragProp,DragState} from './type'




export class Drag extends React.Component<DragProp,DragState>{
    private _isDragging:boolean = false
    private _prevX:number
    private _prevY:number
    constructor(props:DragProp){
        super(props);
        this.state = {
            
        }
    }
    onDragStart=(e:React.DragEvent)=>{
        const {clientX,clientY} = e;
        this._prevX = clientX;
        this._prevY = clientY;
        if(!this._isDragging){
            const {onDragStart,data,previewEle} = this.props;
            onDragStart(data,clientX,clientY);
            const dataTransfer = e.dataTransfer;
            dataTransfer.effectAllowed = 'move'
            dataTransfer.dropEffect = 'move'
            // dataTransfer.setDragImage(targetEl,0,0);
            dataTransfer.setDragImage(previewEle,0,0);
        }
        this._isDragging = true
    }
    onDragMove=(e:React.DragEvent)=>{
        if(!this._isDragging) return;
        const {clientX,clientY} = e;
        // console.log(clientX,clientY,pageX,pageY,screenX,screenY);
        if(this._prevX === clientX && this._prevY === clientY) return;
        this._prevX = clientX;
        this._prevY = clientY;
        const {onDragMove} = this.props;
        onDragMove(clientX,clientY);
        e.preventDefault();
    }
    onDragEnd=(e:React.DragEvent)=>{
        e.dataTransfer.clearData();
        const {onDragEnd} = this.props;
        onDragEnd();
        this._isDragging = false
        // e.preventDefault();
    }
    render(){
        const {className,children} = this.props;
        return <div className={className} draggable 
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDrag={this.onDragMove}
        >
            {children}
        </div>
    }
}