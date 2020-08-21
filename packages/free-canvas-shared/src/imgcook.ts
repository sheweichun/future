

export interface ImgCookDsl{
    taskId: string,
    pluginVersion: string,
    reference: string,
    type: ImgCookNodeType,
    id: string,
    __VERSION__: string,
    props: {
        style: CSSStyleDeclaration,
        attrs: ImgCookAttr
    },
    children: ImgCookItem[]
}

export interface ImgCookAttr{
    x:number,
    y:number,
    source?:string,
    text?: string,
    lines?: number
}

export enum ImgCookNodeType{
    TEXT="Text",
    IMAGE="Image",
    SHAPE="Shape",
    BLOCK="Block"
}

export interface ImgCookTextAttr extends ImgCookAttr{
    text?: string,
    lines?: number
}

export interface ImgCookImgAttr extends ImgCookAttr{
    source?:string,
}

export interface ImgCookItem{
    type: ImgCookNodeType,
    id: string,
    __VERSION__: string,
    selfId:string,
    originType: string,
    nodeLayerName: string,
    props: {
        style: CSSStyleDeclaration,
        attrs: ImgCookAttr | ImgCookTextAttr | ImgCookImgAttr
    },
    children: ImgCookItem[]
}



