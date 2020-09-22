
import {Model,DSLType,ImgCookDsl} from 'free-canvas-shared'
import {transformImgCookDsl} from './imgcook/index'


export function transformDsl(data:(Model | ImgCookDsl)[],type:DSLType):Model{
    return {
        type:0,
        extra:{},
        props:{style:{value:{}}},
        // isGroup:false,
        children:data.map((item)=>{
            if(type === DSLType.IMGCOOK){
                return transformImgCookDsl(item as ImgCookDsl)
            }
            return item as Model;
        })
    }
}