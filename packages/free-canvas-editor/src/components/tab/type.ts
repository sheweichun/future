export interface TabDataItem{
    label:string
    icon?:string
}



export interface TabProps{
    className?:string
    data:TabDataItem[],
    onChange:(index:number)=>void
    index:number
}

export interface TabState{

}