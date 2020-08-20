import {ICanvas} from '../core/type';

export interface IEvent{
    fireEvent(name:string,e:MouseEvent,repaint:()=>void):void
}

export abstract class Entity implements IEvent{
    change(timestamp:number):void{}
    size(width:number,height:number):void{}
    fireEvent(name:string,e:MouseEvent,repaint:()=>void):void{}
    abstract draw(drawer:ICanvas):void;
}

export abstract class DrawEntity extends Entity{
    constructor(protected _drawer:ICanvas){
        super();
    }
}


export class Point{
    constructor(public x:number,public y:number){}
    getDistance(point:Point){
        return Math.abs(Math.sqrt(
            Math.pow(
                point.y - this.y,
                2
            ) + Math.pow(
                point.x - this.x,
                2
            )
        ))
    }
    changeX(x:number){
        return new Point(x,this.y)
    }
    changeY(y:number){
        return new Point(this.x,y);
    }   
    getYDistance(point:Point){
        return Math.abs(point.y - this.y)
    }
    getXDistance(point:Point){
        return Math.abs(point.x - this.x)
    }
    clone(){
        return new Point(this.x,this.y);
    }
    addX(x:number){
        return new Point(this.x + x,this.y);
    }
    addY(y:number){
        return new Point(this.x ,this.y + y);
    }
}
