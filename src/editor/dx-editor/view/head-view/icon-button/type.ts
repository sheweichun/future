


// export interface IconButtongDataItem{
//     title:string,
//     key:string
// }

export interface IconButtonProps{
    // data:IconButtongDataItem[],
    title:string,
    type:string,
    disable?:boolean,
    active?:boolean,
    onClick?:(type:string)=>void
    // activeKey?:string
}

export interface IconButtonState{

}