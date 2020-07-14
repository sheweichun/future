export interface LineOption{
    lineStyle?:string,
    lineDash?:number[]
}

export interface LineMarkOption extends LineOption{
    size?:number,
    val:string,
    fontStyle?:string
    fontWeight?:string
    padding?:number
    margin?:number
    radius?:number
    fontSize?:number
    fontFamily?:string
    color?:string
}

export interface RectOption{
    width:number
    height:number,
    x:number,
    y:number
    color?:string
}