

export interface GuideManagerOptions{
    margin:number,
    getOffsetx(x:number):number,
    getOffsety(x:number):number
}


export interface GuideOptions extends GuideManagerOptions{
    gap?:number
}