
import {Model,DSLType,ImgCookDsl, ModelType} from 'free-canvas-shared'
import {transformImgCookDsl} from './imgcook/index'


export function transformDsl(data:(Model | ImgCookDsl)[],type:DSLType):Model{
    return {
        type:ModelType.isRoot,
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