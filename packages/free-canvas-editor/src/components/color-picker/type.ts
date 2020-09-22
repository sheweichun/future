

export enum ColorSource{
    rgb="rgb",
    hsl="hsl",
    hex="hex",
    hsv="hsv"
}

export interface HSLData{
    h?: number,
    s?: number,
    l?: number,
    v?: number,
    a?: number,
    source?:ColorSource
}

export interface HEXData{
    hex?: number,
    source?:ColorSource
}

export interface RGBData{
    r:number,
    g:number,
    b:number,
    a:number,
    source?:ColorSource
}