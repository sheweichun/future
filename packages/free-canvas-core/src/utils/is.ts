export function isString(str:String){
    return str instanceof String || typeof str=='string';
}


export function numIsEqual(left:number,right:number){
    return Math.abs(left - right) < 0.00001
}