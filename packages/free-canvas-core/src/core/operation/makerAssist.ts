import {OperationPos,Utils} from 'free-canvas-shared';
import { IViewModel } from '../../render/type';
import {AlignType, AlignItem,AlignValue,MarkEntityType,MakerAssistOptions, MakerData} from './type';
import { GuideManager } from '../guide/index'

enum BlockType{
    HORIZONTAL_LEFT="0",
    HORIZONTAL_RIGHT="1",
    VERTICAL_TOP="2",
    VERTICAL_BOTTOM="3"
}

enum BlockDirectionType{
    // HORIZONTAL_LEFT="0",
    // HORIZONTAL_RIGHT="1",
    // VERTICAL_TOP="2",
    // VERTICAL_BOTTOM="3"

    HORIZONTAL,
    VERTICAL,
}

function isOverLap(blk1:Block,blk2:Block){
    return Utils.isOverLap(blk1.left,blk1.top,blk1.right,blk1.bottom,blk2.left,blk2.top,blk2.right,blk2.bottom);
}

type BlockIndex = [number,number]

interface Block{
    indexs:BlockIndex,
    directionType:BlockDirectionType,
    type:BlockType,
    left:number,
    top:number,
    right:number,
    bottom:number,
    size:number
}

// interface AlignItem {
//     type:AlignType,
//     vm:IViewModel,
//     left?:number,
//     top?:number,
//     right?:number,
//     bottom?:number,
// }

// interface AlignValue{
//     isVertical:boolean,
//     data:AlignItem[]
// }

interface AlignMap {
    [key:string]:AlignValue
}

type BlockItem = {[key in BlockType]?:Block}


// function arrayHasSameItem(a:BlockIndex,b:BlockIndex){
//     return (a[0] === b[0] && a[1] === b[1]) || (a[0] === b[1] && a[1] === b[0])
// }

// function createBlock(type:BlockType,
//     left:number,
//     top:number,
//     right:number,
//     bottom:number,){
//         return {
//             type,
//             left,
//             top,
//             right,
//             bottom,
//         }
// }

function calculateBlock(a:OperationPos,aIndex:number,b:OperationPos,bIndex:number):Block{
    const leftA = a.left,rightA = a.left + a.width,topA = a.top,bottomA = a.top + a.height;
    const leftB = b.left,rightB = b.left + b.width,topB = b.top,bottomB = b.top + b.height;
    let retBlock:Block;
    const indexs:BlockIndex = [aIndex,bIndex];
    let hNotOverlapFlag = rightA <= leftB || leftA >= rightB   //横向没有重叠部分
    let vNotOverlapFlag = topA >= bottomB || bottomA <= topB; //竖向没有重叠部分

    if(hNotOverlapFlag){
        if(!vNotOverlapFlag){
            // const aLeftB = rightA < leftB;
            const left = rightA < rightB ? rightA : rightB,right = leftA > leftB ? leftA : leftB
            retBlock = {
                indexs,
                type:rightA < leftB ? BlockType.HORIZONTAL_LEFT : BlockType.HORIZONTAL_RIGHT,
                directionType:BlockDirectionType.HORIZONTAL,
                top:topA < topB ? topA : topB,
                bottom:bottomA > bottomB ? bottomA : bottomB,
                left,
                right,
                size:right - left
            }
        }
    }else if(vNotOverlapFlag){
        const top = bottomA < bottomB ? bottomA : bottomB,bottom = topA > topB ? topA : topB;
        retBlock = {
            indexs,
            type:bottomA < topB ?  BlockType.VERTICAL_TOP : BlockType.VERTICAL_BOTTOM,
            directionType:BlockDirectionType.VERTICAL,
            left:leftA < leftB ? leftA : leftB,
            right:rightA > rightB ? rightA : rightB,
            top,
            bottom,
            size:bottom - top
        }
    }
    return retBlock
}


function addAlignItem(data:AlignMap,value:number,item:AlignItem,isVertical:boolean = false){
    let itemList = data[value];
    if(itemList == null){
        itemList = {
            isVertical,
            value,
            data:[]
        };
        data[value] = itemList;
    }
    itemList.data.push(item);
}

// function sortNumbStr(a:string,b:string){ //从小到大
//     return parseFloat(a) - parseFloat(b)
// }

interface MinestItem{
    item:AlignValue,minAbsGap:number,minVal:number
}

interface MinestBlockItem{
    item:Block[],minAbsGap:number,minVal:number
}

function findMinest(...data:MinestItem[]){
    return data.sort((a,b)=>{
        return a.minAbsGap - b.minAbsGap
    })[0];
}
function findMinestBlock(...data:MinestBlockItem[]){
    return data.sort((a,b)=>{
        return a.minAbsGap - b.minAbsGap
    })[0];
}

function str2Float(val:string){
    return parseFloat(val)
}

function keySort(a:number,b:number){
    return a - b
}

function findMinDistance(...data:number[]){
    let base = Infinity;
    data.forEach((val)=>{
        if(val === 0) return;
        if(val < base){
            base = val;
        }
    })
    return isFinite(base) ? base : 0;
}
interface BlockMap {
    [key:string]:Block[]
}
const ADSORB_DISTANCE = 4;

//辅助标注
export default class MakerAssist{
    private _asbPosList:OperationPos[] = [];

    private _verticalBlockMap:BlockMap = {};
    private _verticalBlockKeys:number[];
    private _horizontalBlockMap:BlockMap = {};
    private _horizontalBlockKeys:number[];

    private _horizontalAlignMap:AlignMap = {};
    private _horizontalMiddleAlignMap:AlignMap = {};
    private _verticalAlignMap:AlignMap = {};
    private _verticalMiddleAlignMap:AlignMap = {};

    private _verticalKeys:number[] = []
    private _verticalMiddleKeys:number[] = []
    private _horizontalKeys:number[] = []
    private _horizontalMiddleKeys:number[] = []

    constructor(private _artBoard:IViewModel,vms:IViewModel[],private _guideManager:GuideManager,private _options:MakerAssistOptions){
        this.updateVms(vms);
    }
    updateVms(vms:IViewModel[]){
        const blockMap:{[key:string]:Block} = {};
        const vmPoses = vms.map((vm,index)=>{
            // console.log(`index -> id : ${index} --> ${vm.getModel().get('id',null)}`);
            const rect = vm.getAbsRect();
            this.addAlignItem(vm.getRect(),vm);
            return rect;
        })
        this._asbPosList = vmPoses;
        const len = vmPoses.length;
        for(let i = 0; i < len; i++){
            const aPos = vmPoses[i];
            let addBlockItem:BlockItem = {};
            for(let j = 0; j < len ; j++){
                const bPos = vmPoses[j];
                if(i === j) continue;
                const block = calculateBlock(aPos,i,bPos,j);
                if(block == null) continue;
                const curOldBlock = addBlockItem[block.type];
                if(curOldBlock == null || curOldBlock.size > block.size){
                    addBlockItem[block.type] = block;
                }
            }
            Object.keys(addBlockItem).forEach((key:string)=>{ //为了防止重复计算的问题
                const item = addBlockItem[key as BlockType];
                if(item == null) return;
                const {indexs} = item
                const aId = `${indexs[0]}-${indexs[1]}`,bId = `${indexs[1]}-${indexs[0]}`
                const aItem = blockMap[aId],bItem = blockMap[bId];
                if(aItem == null && bItem == null){
                    blockMap[aId] = item
                }
            })
        }
        const {_horizontalBlockMap,_verticalBlockMap} = this;
        Object.keys(blockMap).forEach((key)=>{
            const blk = blockMap[key];
            if(blk == null) return;
            let targetBlockMap:{[key:string]:Block[]} = blk.directionType === BlockDirectionType.HORIZONTAL ? _horizontalBlockMap : _verticalBlockMap;
            let item = targetBlockMap[blk.size];
            if(item == null){
                item = [];
                targetBlockMap[blk.size] = item;
            }
            item.push(blk)
        })
        this._verticalBlockKeys = Object.keys(_verticalBlockMap).map(str2Float).sort(keySort);
        this._horizontalBlockKeys = Object.keys(_horizontalBlockMap).map(str2Float).sort(keySort);
    }
    addAlignItem(pos:OperationPos,vm:IViewModel){
        const {left,top,right,bottom} = pos;
        addAlignItem(this._verticalAlignMap,left,{type:AlignType.VERTICAL_LEFT,vm,top,bottom},true);
        addAlignItem(this._verticalAlignMap,right,{type:AlignType.VERTICAL_RIGHT,vm,top,bottom},true);
        // addAlignItem(this._verticalAlignMap,pos.getHMiddle(),{type:AlignType.VERTICAL_MIDDLE,vm,top,bottom},true);

        addAlignItem(this._verticalMiddleAlignMap,pos.getHMiddle(),{type:AlignType.VERTICAL_MIDDLE,vm,top,bottom},true);

        addAlignItem(this._horizontalAlignMap,top,{type:AlignType.HORIZONTAL_TOP,vm,left,right},false);
        addAlignItem(this._horizontalAlignMap,bottom,{type:AlignType.HORIZONTAL_BOTTOM,vm,left,right},false);


        addAlignItem(this._horizontalMiddleAlignMap,pos.getVMiddle(),{type:AlignType.HORIZONTAL_MIDDLE,vm,left,right},false);
        this.initKeys();

        const {vGuide,hGuide} = this._guideManager
        hGuide.getOffsetList().forEach((hval)=>{
            addAlignItem(this._verticalAlignMap,hval,{
                type:AlignType.VERTICAL_GUIDE
            },true)
        })
        vGuide.getOffsetList().forEach((vval)=>{
            addAlignItem(this._horizontalAlignMap,vval,{
                type:AlignType.HORIZONTAL_GUIDE
            },false)
        })
    }
    initKeys(){
        const {_verticalAlignMap,_verticalMiddleAlignMap,_horizontalAlignMap,_horizontalMiddleAlignMap} = this;
        this._verticalKeys = Object.keys(_verticalAlignMap).map(str2Float).sort(keySort);
        this._verticalMiddleKeys = Object.keys(_verticalMiddleAlignMap).map(str2Float).sort(keySort);
        this._horizontalKeys = Object.keys(_horizontalAlignMap).map(str2Float).sort(keySort);
        this._horizontalMiddleKeys = Object.keys(_horizontalMiddleAlignMap).map(str2Float).sort(keySort);
    }
    calculateAlignInfo(verticalKeys:number[],alignMap:AlignMap,baseValue:number){
        let minest:MinestItem = {item:null,minAbsGap:Infinity,minVal:null}
        for(let i = 0 ; i < verticalKeys.length; i++){
            const val = verticalKeys[i];
            const item = alignMap[val];
            // console.log('in calculateAlignInfo',val,baseValue);
            const curGap =  baseValue - val;
            if(baseValue === val){ //左边对齐
                minest.item = item;
                minest.minAbsGap = 0;
                minest.minVal = 0;
                break;
            }else if(val > baseValue){
                const curMinestItem = {item,minAbsGap:Math.abs(curGap),minVal:-curGap}
                if(i === 0){
                    minest = curMinestItem;
                }else{
                    const lastVal = verticalKeys[i - 1];
                    const lastItem = alignMap[lastVal];
                    const lastCap = lastVal - baseValue;
                    minest = findMinest(curMinestItem,{
                        item:lastItem,
                        minAbsGap:Math.abs(lastCap),
                        minVal:lastCap
                    },minest);
                }
                break;
            }else if(i === verticalKeys.length - 1){
                minest = {item,minAbsGap:Math.abs(curGap),minVal:curGap}
            }
        }
        return minest
    }
    calculateEachDirection(keys:number[],alignMap:AlignMap,baseValueList:number[]){
        let minestItem:MinestItem;let minGap = Infinity;
        let moveDistance:number = 0;
        baseValueList.forEach((val)=>{
            const ret = this.calculateAlignInfo(keys,alignMap,val);
            if(ret.minVal === 0){
                minGap = -1;
                minestItem = null;
            }else if(ret.minAbsGap < minGap){
                minGap = ret.minAbsGap;
                minestItem = ret;
            }
            return ret;
        })
        if(minestItem && minestItem.minAbsGap <= ADSORB_DISTANCE){
            moveDistance = minestItem.minVal
        }
        return moveDistance
    }
    verticalAlignItem2MarkerData(item:AlignValue,top:number,bottom:number):MakerData{
        let makerTop = top,makerBottom = bottom;
        const {value} = item;
        for(let i = 0 ; i < item.data.length; i++){
            const dataItem = item.data[i]
            const {top:dTop,bottom:dBottom,type} = dataItem;
            if(type === AlignType.HORIZONTAL_GUIDE || type === AlignType.VERTICAL_GUIDE) return
            if(dTop < makerTop) {makerTop = dTop}
            if(dBottom > makerBottom) {makerBottom = dBottom}
        }
        // item.data.forEach((dataItem)=>{
        //     const {top:dTop,bottom:dBottom} = dataItem;
        //     if(dTop < makerTop) {makerTop = dTop}
        //     if(dBottom > makerBottom) {makerBottom = dBottom}
        // })
        return {
            type:MarkEntityType.Line,
            data:{
                x1:value,
                y1:makerTop,
                x2:value,
                y2:makerBottom,
                lineStyle:'red'
            }
        }
    }
    horizontalAlignItem2MarkerData(item:AlignValue,left:number,right:number):MakerData{
        let makerLeft = left,makerRight = right;
        const {value} = item;
        for(let i = 0 ; i < item.data.length; i++){
            const dataItem = item.data[i]
            const {left:dLeft,right:dRight,type} = dataItem;
            if(type === AlignType.HORIZONTAL_GUIDE || type === AlignType.VERTICAL_GUIDE) return
            if(dLeft < makerLeft) {makerLeft = dLeft}
            if(dRight > makerRight) {makerRight = dRight}
        }
        // item.data.forEach((dataItem)=>{
            
        // })
        
        return {
            type:MarkEntityType.Line,
            data:{
                x1:makerLeft,
                y1:value,
                x2:makerRight,
                y2:value,
                lineStyle:'red'
            }
        }
    }
    calculateBlockInfo(blk:Block,keys:number[],blockMap:BlockMap,needTransform:boolean = false){
        const {size} = blk;
        let minest:MinestBlockItem = {item:null,minAbsGap:Infinity,minVal:null}
        for(let i = 0 ; i < keys.length; i++){
            const val = keys[i];
            const item = blockMap[val];
            const curGap = size - val;
            if(size === val){ //左边对齐
                minest.item = item;
                minest.minAbsGap = 0;
                minest.minVal = 0;
                break;
            }else if(val > size){
                const curMinestItem = {item,minAbsGap:Math.abs(curGap),minVal:-curGap}
                if(i === 0){
                    minest = curMinestItem;
                }else{
                    const lastVal = keys[i - 1];
                    const lastItem = blockMap[lastVal];
                    const lastCap = lastVal - size;
                    minest = findMinestBlock(curMinestItem,{
                        item:lastItem,
                        minAbsGap:Math.abs(lastCap),
                        minVal:lastCap
                    },minest);
                }
                break;
            }else if(i === keys.length - 1){
                minest = {item,minAbsGap:Math.abs(curGap),minVal:curGap}
            }
        }
        needTransform && (minest.minVal *= -1)
        return minest
    }
    calculateEachDirectionBlockInfo(blockList:Block[],keys:number[],blockMap:BlockMap,type:BlockType){
        let minestItem:MinestBlockItem;let minGap = Infinity;
        let moveDistance:number = 0;
        blockList.forEach((blk)=>{
            const ret = this.calculateBlockInfo(blk,keys,blockMap,blk.type === type);
            if(ret.minVal === 0){
                minGap = -1;
                minestItem = null;
            }else if(ret.minAbsGap < minGap){
                minGap = ret.minAbsGap;
                minestItem = ret;
            }
            return ret;
        })
        if(minestItem && minestItem.minAbsGap <= ADSORB_DISTANCE){
            moveDistance = minestItem.minVal
        }
        return moveDistance
    }
    calculateSelectedBlocks(selectedPos:OperationPos){
        const {_asbPosList,_verticalBlockMap,_verticalBlockKeys,_horizontalBlockMap,_horizontalBlockKeys} = this;
        const verticalBlockList:Block[] = [];
        const horizontalBlockList:Block[] = [];
        _asbPosList.forEach((pos,index)=>{
            // const block = calculateBlock(pos,index,selectedPos,-1);
            const block = calculateBlock(selectedPos,-1,pos,index);
            if(block == null) return;
            const {directionType} = block;
            if(directionType === BlockDirectionType.HORIZONTAL){
                horizontalBlockList.push(block);
            }else{
                verticalBlockList.push(block);
            }
        })
        const moveX = this.calculateEachDirectionBlockInfo(horizontalBlockList,_horizontalBlockKeys,_horizontalBlockMap,BlockType.HORIZONTAL_LEFT);
        const moveY = this.calculateEachDirectionBlockInfo(verticalBlockList,_verticalBlockKeys,_verticalBlockMap,BlockType.VERTICAL_TOP);
        return {
            moveX,
            moveY
        }
    }
    calculateAbsorb(pos:OperationPos){ 
        if(pos == null) return;
        if(!this._artBoard.getRect().isOverlap(pos)) return {moveX:0,moveY:0};
        const {left,right,top,bottom} = pos;
        const {_verticalAlignMap,_verticalMiddleAlignMap,_horizontalAlignMap,_horizontalMiddleAlignMap,
        _verticalKeys,_verticalMiddleKeys,_horizontalKeys,_horizontalMiddleKeys} = this;
        const verticalMovex= this.calculateEachDirection(_verticalKeys,_verticalAlignMap,[left,right]);
        const verticalMiddleMovex= this.calculateEachDirection(_verticalMiddleKeys,_verticalMiddleAlignMap,[pos.getHMiddle()]);
        const horizontalMovey = this.calculateEachDirection(_horizontalKeys,_horizontalAlignMap,[top,bottom]);
        const horizontalMiddleMovey = this.calculateEachDirection(_horizontalMiddleKeys,_horizontalMiddleAlignMap,[pos.getVMiddle()]);
        const blockRet = this.calculateSelectedBlocks(this.transformAbsRect(pos));
        return {
            moveX:findMinDistance(verticalMovex,verticalMiddleMovex,blockRet.moveX),
            moveY:findMinDistance(horizontalMovey,horizontalMiddleMovey,blockRet.moveY),
        }
        // return {x,y}
    }
    extraAlignValue(keys:number[],alignMap:AlignMap,baseValueList:number[],data:AlignValue[]){
        for(let i = 0; i < keys.length; i++){
            const curVal = keys[i];
            const baseIndex = baseValueList.indexOf(curVal);
            if( baseIndex >= 0 ){
                baseValueList.splice(baseIndex,1);
                data.push(alignMap[curVal])
                if(baseValueList.length === 0) return;
            }
        }
    }
    transformAbsRect(curPos:OperationPos){
        const pos = this._options.getRect();
        return curPos.moveLeftAndTop_immutation(pos.left,pos.top)
    }
    getAlignMakerDataList(pos:OperationPos){
        const data:AlignValue[] = []
        const {left,right,top,bottom} = pos;
        const {_verticalAlignMap,_verticalMiddleAlignMap,_horizontalAlignMap,_horizontalMiddleAlignMap,
            _verticalKeys,_verticalMiddleKeys,_horizontalKeys,_horizontalMiddleKeys} = this;
        this.extraAlignValue(_verticalKeys,_verticalAlignMap,[left,right],data);
        this.extraAlignValue(_verticalMiddleKeys,_verticalMiddleAlignMap,[pos.getHMiddle()],data);
        this.extraAlignValue(_horizontalKeys,_horizontalAlignMap,[top,bottom],data);
        this.extraAlignValue(_horizontalMiddleKeys,_horizontalMiddleAlignMap,[pos.getVMiddle()],data);
        const makerDataList :MakerData[] = []
        for(let i = 0 ; i< data.length; i++){
            let makerData:MakerData;
            const item = data[i];
            if(item.isVertical){
                makerData = this.verticalAlignItem2MarkerData(item,top,bottom)
            }else{
                makerData = this.horizontalAlignItem2MarkerData(item,left,right);
            }
            if(makerData){
                makerDataList.push(makerData);
            }
        }
        return makerDataList
    }
    static getBlockListByValue(keys:number[],blockMap:BlockMap,block:Block){
        const {size} = block
        for(let i = 0 ;i < keys.length; i++){
            const curVal = keys[i];
            if(curVal === size){
                const blkList = blockMap[curVal]
                return blkList.filter((blk)=>{
                    return !isOverLap(block,blk);
                })
            }
        }
        return [];
    }
    getBlockMakerDataList(selectedPos:OperationPos){
        const {_asbPosList,_verticalBlockMap,_verticalBlockKeys,_horizontalBlockMap,_horizontalBlockKeys} = this;
        const hightBlocks:Block[] = []
        _asbPosList.forEach((pos,index)=>{
            const block = calculateBlock(selectedPos,-1,pos,index);
            if(block == null) return;
            let blockList:Block[];
            const {directionType} = block;
            if(directionType === BlockDirectionType.HORIZONTAL){
                blockList = MakerAssist.getBlockListByValue(_horizontalBlockKeys,_horizontalBlockMap,block)
            }else{
                blockList = MakerAssist.getBlockListByValue(_verticalBlockKeys,_verticalBlockMap,block)
            }
            if(blockList.length > 0){
                // hightBlocks.push();
                hightBlocks.push(block,...blockList);
            }
        })
        return hightBlocks.map((blk:Block)=>{
            return {
                type:MarkEntityType.RectMark,
                data:{
                    left:blk.left,
                    right:blk.right,
                    top:blk.top,
                    bottom:blk.bottom,
                    val:blk.size + '',
                    background:'#ff3db156'
                }
            }
        })
    }
    maker(pos:OperationPos):MakerData[]{ 
        if(pos == null) return;
        // const {updateMakers} = this._options
        if(!this._artBoard.getRect().isOverlap(pos)) return [];
        const makerDataList:MakerData[] = []
        const alignList = this.getAlignMakerDataList(pos);
        makerDataList.push(...alignList);

        const blockList = this.getBlockMakerDataList(this.transformAbsRect(pos));
        makerDataList.push(...blockList);
        // Object.keys(this._blockMap).forEach((val:string)=>{
        //     const blockList = this._blockMap[val];
        //     blockList.forEach((blk)=>{
        //         makerDataList.push({
        //             type:MarkEntityType.RectMark,
        //             data:{
        //                 left:blk.left,
        //                 right:blk.right,
        //                 top:blk.top,
        //                 bottom:blk.bottom,
        //                 val:blk.indexs + '',
        //                 background:'#ff3db156'
        //             }
        //         })
        //     })
        // })
        return makerDataList
    }
}


// const {updateMakers} = this._options
//         const makerDataList:MakerData[] = []
//         const {left,right,top,bottom} = pos;
//         alignList.forEach((item)=>{
//             let markerData:MakerData;
//             if(item.isVertical){
//                 markerData = this.verticalAlignItem2MarkerData(item,top,bottom)
//             }else{
//                 markerData = this.horizontalAlignItem2MarkerData(item,left,right)
//             }
//             makerDataList.push(markerData)
//         })
//         updateMakers(makerDataList)