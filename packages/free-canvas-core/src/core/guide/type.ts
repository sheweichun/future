

export interface offsetData{
    value:number
    offset:number
}

export interface GuideManagerOptions{
    margin:number,
    getOffsetx(x:number):offsetData,
    getOffsety(x:number):offsetData
}


export interface GuideOptions extends GuideManagerOptions{
    gap?:number
}