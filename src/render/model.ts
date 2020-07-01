import {ViewAttribute} from './type';

export class Model{
    static EmptyModel = new Model(null,null,null)
    constructor(public tag:string,public attribute:ViewAttribute,public children:Model[]){

    }
    
}