
import { IViewModel } from '../../render/type';
import {CalculateItem,MarkType,MakerData, AlignItemMap, AlignType,AlignItemVms,MarkEntityType} from './type'
import {OperationPos} from './pos';

// export function eachViewModel(vm:IViewModel,fn:(ret:any,vm:IViewModel)=>any,defaultVal?:any){
//     let fnRet = defaultVal
//     if(!vm.isRoot){
//         fnRet = fn(fnRet,vm);
//     }
//     if(vm.children){
//         vm.children.viewModelList.forEach((vm)=>{
//             fnRet = eachViewModel(vm,fn,fnRet);
//         })
//     }
//     return fnRet
// }

// function calclulateLeftItem(target:CalculateItem,vm:IViewModel){
//     if(target == null || (isBigger ? target.val > val:target.val < val)){
//         return {
//             val:val,
//             vm:vm
//         }
//     }
//     return target
// }
function createInfo(vm:IViewModel,val:number,type:MarkType){
    return {val,type,vm}
}

function calclulateItem(target:IViewModel,pos:OperationPos){
    const {left:curLeft,top:curTop,width:curWidth,height:curHeight} = pos;
    const {left,top,width,height} = target.getRect();
    const curBottom = curTop + curHeight,curRight = curLeft + curWidth,
    bottom = top + height,right = left + width
    // if(curLeft < left || curTop > bottom || curBottom < top) return null;
    let isLeftLLeftRightLLeft = right < curLeft,
    isLeftRRightRightRRight = left > curRight,
    // isLeftLeftRightRight = left + width > curLeft && left < curHeight

    isTopTTopBottomTTop = bottom < curTop,
    isTopBBottomBottomBBottom = top > curBottom;
    // isTopTopBottomBottom =
    let arr:any[] = []
    let type,diff;
    if(isLeftLLeftRightLLeft){
        if(!isTopTTopBottomTTop && ! isTopBBottomBottomBBottom){
            arr.push(createInfo(target,curLeft - right,MarkType.OUTER_LEFT))
        }
    }else if(isLeftRRightRightRRight){
        if(!isTopTTopBottomTTop && ! isTopBBottomBottomBBottom){
            arr.push(createInfo(target,left - curRight,MarkType.OUTER_RIGHT))
        }
    }else if(left < curLeft){
        if(isTopTTopBottomTTop){
            arr.push(createInfo(target,curTop - bottom,MarkType.OUTER_TOP))
        }else if(isTopBBottomBottomBBottom){
            arr.push(createInfo(target,top - curBottom,MarkType.OUTER_BOTTOM))
        }
        else{
            if(right > curRight){
                arr.push(createInfo(target,right - curRight,MarkType.INNER_RIGHT));
            }
            if(top < curTop){
                arr.push(
                createInfo(target,curLeft - left,MarkType.INNER_LEFT),
                createInfo(target,curTop - top,MarkType.INNER_TOP))
                if(bottom > curBottom){
                    arr.push(createInfo(target,bottom - curBottom,MarkType.INNER_BOTTOM))
                }
            }else if(bottom > curBottom){
                arr.push(
                    createInfo(target,curLeft - left,MarkType.INNER_LEFT),
                    createInfo(target,bottom - curBottom,MarkType.INNER_BOTTOM))
            }
        }
    }else if(left > curLeft && right < curRight){
        if(isTopTTopBottomTTop){
            arr.push(createInfo(target,curTop - bottom,MarkType.OUTER_TOP))
        }else if(isTopBBottomBottomBBottom){
            arr.push(createInfo(target,top - curBottom,MarkType.OUTER_BOTTOM))
        }else if(top < curTop){
            arr.push(
                createInfo(target,curTop - top,MarkType.INNER_TOP))
        }else if(bottom > curBottom){
            arr.push(
                createInfo(target,bottom - curBottom,MarkType.INNER_BOTTOM)
            )
        }
    }else if(right > curRight){
        if(isTopTTopBottomTTop){
            arr.push(createInfo(target,curTop - bottom,MarkType.OUTER_TOP))
        }else if(isTopBBottomBottomBBottom){
            arr.push(createInfo(target,top - curBottom,MarkType.OUTER_BOTTOM))
        }else {
            arr.push(createInfo(target,right - curRight,MarkType.INNER_RIGHT));
            if(top < curTop){
                arr.push(
                    createInfo(target,curTop - top,MarkType.INNER_TOP))
            }else if(bottom > curBottom){
                arr.push(
                    createInfo(target,bottom - curBottom,MarkType.INNER_BOTTOM)
                )
            }
        }
    }

    return arr
}

// function calculateAlign(
//     pos:
//     verticalAlignMap:AlignItemVms,
//     horizontalAlignMap:AlignItemVms)

function initAlignMap(pos:OperationPos){
    const {left,top,width,height} = pos;
    const right = left + width,bottom = top + height;
    const alignMap:AlignItemMap = {
        left:{
            type:AlignType.VERTICAL_LEFT,
            vms:[],
            value:left,
            isVertical:true,
            top,
            bottom
        },
        right:{
            type:AlignType.VERTICAL_RIGHT,
            vms:[],
            isVertical:true,
            top,
            value:right,
            bottom
        },
        hmiddle:{
            type:AlignType.VERTICAL_MIDDLE,
            vms:[],
            isVertical:true,
            value:pos.getHMiddle(),
            top,
            bottom
        },
        top:{
            type:AlignType.HORIZONTAL_TOP,
            vms:[],
            isVertical:false,
            value:top,
            left,
            right
        },
        bottom:{
            type:AlignType.HORIZONTAL_BOTTOM,
            vms:[],
            isVertical:false,
            value:bottom,
            left,
            right
        },
        vmiddle:{
            type:AlignType.HORIZONTAL_MIDDLE,
            vms:[],
            value:pos.getVMiddle(),
            isVertical:false,
            left,
            right
        }
    }
    return alignMap
}

function updateVericalAlign(item:AlignItemVms,vm:IViewModel,alignTop:number,alignBottom:number){
    if(item == null || !item.isVertical) return 
    const {vms,top,bottom} = item;
    vms.push(vm);
    if(alignTop < top){
        item.top = alignTop
    }
    if(alignBottom > bottom){
        item.bottom = alignBottom
    }
}

function updateHorizontalAlign(item:AlignItemVms,vm:IViewModel,alignLeft:number,alignRight:number){
    if(item == null || item.isVertical) return 
    const {vms,left,right} = item;
    vms.push(vm);
    if(alignLeft < left){
        item.left = alignLeft
    }
    if(alignRight > right){
        item.right = alignRight
    }
}

function extractAlignItem(item:AlignItemVms,value:number){
    if(item.value === value){
        return item
    }
    return null
}

function udpdateAlignMap(alignMap:AlignItemMap,vm:IViewModel){
    const pos = vm.getRect();
    const {left,top,width,height} = pos;
    const right = left + width,bottom = top + height;
    const leftAlign = extractAlignItem(alignMap.left,left),rightAlign = extractAlignItem(alignMap.right,right),
    topAlign = extractAlignItem(alignMap.top,top),bottomAlign = extractAlignItem(alignMap.bottom,bottom),
    vMiddleAlign = extractAlignItem(alignMap.hmiddle,pos.getHMiddle()),hMiddleAlign = extractAlignItem(alignMap.vmiddle,pos.getVMiddle())
    updateVericalAlign(leftAlign,vm,top,bottom)
    updateVericalAlign(rightAlign,vm,top,bottom)
    updateVericalAlign(vMiddleAlign,vm,top,bottom)
    updateHorizontalAlign(topAlign,vm,left,right)
    updateHorizontalAlign(bottomAlign,vm,left,right)
    updateHorizontalAlign(hMiddleAlign,vm,left,right)
}

// function isChildren(selectModels:IViewModel[],target:IViewModel){
//     for(let i = 0; i < selectModels.length; i++){
//         const item = selectModels[i];
//         if(target.isChildren(item)){
//             return true;
//         }
//     }
//     return false;
// }

export function calculateLatestVm(ret:{
    curPos?:OperationPos,
    data?:CalculateItem[],
    selectModels?:IViewModel[],
    alignMap?:AlignItemMap
    // verticalAlignMap?:AlignItemVms,
    // horizontalAlignMap?:AlignItemVms
} = {},vm:IViewModel){
    const {data=[],curPos} = ret;
    if(curPos == null) return ret;
    if(ret.alignMap == null){
        ret.alignMap = initAlignMap(curPos)
    }
    udpdateAlignMap(ret.alignMap,vm);
    const result = calclulateItem(vm,curPos);
    result.forEach((ele)=>{
        const {val,type} = ele;
        const item = data[type];
        if(item == null || val < item.val){
            data[type] = ele;
        }
    })
    return ret;
}



function createLineMakerMarkerData(startX:number,
    startY:number,
    endX:number,
    endY:number,
    val:number,type:MarkEntityType = MarkEntityType.LineMarker){
    return {
        type,
        data:{
            startX:startX,
            startY:startY,
            endX: endX,
            endY: endY,
            val
        }
    }
}



export function transformAliItem2MarkerData(data:AlignItemMap){
    const ret:MakerData[] = []
    Object.keys(data).forEach((valStr:keyof AlignItemMap)=>{
        const item = data[valStr];
        const val = item.value;
        const {type,vms} = item;
        if(vms == null || vms.length === 0) return;
        if(type === AlignType.VERTICAL_LEFT 
            || type === AlignType.VERTICAL_RIGHT
            || type === AlignType.VERTICAL_MIDDLE){
                return ret.push({
                    type:MarkEntityType.Line,
                    data:{
                        x1:val,
                        y1:item.top,
                        x2:val,
                        y2:item.bottom,
                        lineStyle:'red'
                    }
                })
        }
        ret.push({
            type:MarkEntityType.Line,
            data:{
                x1:item.left,
                y1:val,
                x2:item.right,
                y2:val,
                lineStyle:'red'
            }
        })
    })
    return ret;
}

export function transformCalculateItem2MarkerData(pos:OperationPos,data:CalculateItem[]):MakerData[]{
    return data.reduce((ret,item)=>{
        if(item == null) return ret;
        const {val,vm,type} = item;
        let x = pos.getHMiddle(),y = pos.getVMiddle();
        const rect = vm.getRect();
        switch(type){
            case MarkType.INNER_LEFT:
                ret.push(createLineMakerMarkerData(pos.left,y,rect.left,y,val))
                break;
            case MarkType.OUTER_LEFT:
                ret.push(createLineMakerMarkerData(pos.left,y,rect.left + rect.width,y,val))
                break;
            case MarkType.INNER_TOP:
                ret.push(createLineMakerMarkerData(x,pos.top,x,rect.top,val))
                break;
            case MarkType.OUTER_TOP:
                ret.push(createLineMakerMarkerData(x,pos.top,x,rect.top + rect.height,val))
                break;
            case MarkType.INNER_RIGHT:
                ret.push(createLineMakerMarkerData(pos.left+pos.width,y,rect.left + rect.width,y,val))
                break;
            case MarkType.OUTER_RIGHT:
                ret.push(createLineMakerMarkerData(pos.left+pos.width,y,rect.left,y,val))
                break;
            case MarkType.INNER_BOTTOM:
                ret.push(createLineMakerMarkerData(x,pos.top + pos.height,x,rect.top + rect.height,val))
                break;
            case MarkType.OUTER_BOTTOM:
                ret.push(createLineMakerMarkerData(x,pos.top+pos.height,x,rect.top,val))
                break;
        }
        return ret;
    },[])
}