

export interface MoveEventData{
    x:number,
    y:number,
    diffx:number,
    diffy:number,
    originX:number,
    originY:number
}

export interface MoveEventOptions{
    onStart?:(data:MoveEventData)=>void
    onMove?:(data:MoveEventData)=>void
    onStop?:(data:MoveEventData)=>void
}