export interface LineOption{
    lineStyle?:string,
    lineDash?:number[]
}


export interface FontOption{
    fontStyle?:string
    fontWeight?:string
    fontSize?:number
    fontFamily?:string
}

export interface LineMarkOption extends LineOption,FontOption{
    size?:number,
    val:string,
    padding?:number
    margin?:number
    radius?:number
    color?:string
}

export interface RectOption{
    // width:number
    // height:number,
    // x:number,
    // y:number
    lineWidth?:number
    background?:string
    color?:string
}


export interface RectMakerOption extends RectOption,FontOption{
    // width:number
    // height:number,
    // x:number,
    // y:number
    showMarker?:boolean
    radius?:number
    intervalLen?:number
    isVertical?:boolean
    lineWidth?:number
    background?:string
    color?:string
}