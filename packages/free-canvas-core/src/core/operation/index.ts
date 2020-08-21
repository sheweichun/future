
import {Mutation} from '../mutation'
import { IViewModel } from '../../render/type';
import {IOperation} from './type';
import {OperationOptions,IDisposable, HANDLER_ITEM_DIRECTION,KeyBoardKeys} from '../type';
import {Utils, modelIsRoot, modelIsGroup, modelIsArtboard} from 'free-canvas-shared'
import { completeOptions } from '../../utils';
import { CanvasEvent } from '../../events/event';
import {OPERATION_CLASSNAME} from '../../utils/constant'
import {Size} from './size';
import { OperationPos,calculateIncludeRect } from './pos';
import {calculateLatestVm,transformCalculateItem2MarkerData, transformAliItem2MarkerData} from './service'
import { KeyBoard } from '../keyboard';
const {encode} = Utils
// import { ViewModel } from 'src/render';
const DEFAULT_OPTIONS = {
    margin:10
}
const MIN_MOVE_DISTANCE = 2;

const HANDLER_ITEM_DIRECTION_HANDLER_MAP:any = {
    [HANDLER_ITEM_DIRECTION.LEFT]:'moveLeft',
    [HANDLER_ITEM_DIRECTION.TOP]:'moveTop',
    [HANDLER_ITEM_DIRECTION.RIGHT]:'moveRight',
    [HANDLER_ITEM_DIRECTION.BOTTOM]:'moveBottom',
    [HANDLER_ITEM_DIRECTION.LEFT_TOP]:'moveLeftTop',
    [HANDLER_ITEM_DIRECTION.LEFT_BOTTOM]:'moveLeftBottom',
    [HANDLER_ITEM_DIRECTION.RIGHT_TOP]:'moveRightTop',
    [HANDLER_ITEM_DIRECTION.RIGHT_BOTTOM]:'moveRightBottom'
}

function eachViewModel(vm:IViewModel,fn:(ret:any,vm:IViewModel)=>any,defaultVal?:any){
    let fnRet = defaultVal
    if(!modelIsRoot(vm.modelType)){
        fnRet = fn(fnRet,vm);
    }
    if(vm.children){
        vm.children.viewModelList.forEach((vm)=>{
            fnRet = eachViewModel(vm,fn,fnRet);
        })
    }
    return fnRet
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

function eachViewModelExcludeSelected(selectModels:IViewModel[],vm:IViewModel,fn:(ret:any,vm:IViewModel)=>any,defaultVal?:any){
    let fnRet = defaultVal
    if(selectModels.indexOf(vm) >= 0){
        return defaultVal
    };
    //isRoot isGroup isArtboard
    // if(vm.modelType == null){
    if(!modelIsRoot(vm.modelType)){
        fnRet = fn(fnRet,vm);
    }
    if(vm.children){
        vm.children.viewModelList.forEach((vm)=>{
            fnRet = eachViewModelExcludeSelected(selectModels,vm,fn,fnRet);
        })
    }
    return fnRet
}

const MOVE_UNIT = 1;
const SHITF_MOVE_UNIT = 4 * MOVE_UNIT;

export class Operation implements IDisposable,IOperation{
    private _root:HTMLElement
    // private _viewModelMap:Map<string,IViewModel> = new Map()
    private _selectViewModels:IViewModel[]
    private _options:OperationOptions
    private _canMove:boolean = false
    private _pos:OperationPos
    private _startX:number
    private _startY:number
    private _originX:number
    private _originY:number
    private _changed:boolean = false
    private _size:Size
    private _hideMakerTmId:NodeJS.Timeout
    private _showMakerTmId:NodeJS.Timeout
    private _rootViewModel:IViewModel;
    constructor(private _parent:HTMLElement,private _mutation:Mutation,private _keyboard:KeyBoard,options:OperationOptions){
        this._options = completeOptions(options,DEFAULT_OPTIONS);
        const div  = document.createElement('div');
        div.style.display = 'none';
        div.className = OPERATION_CLASSNAME
        this._root = div;
        _parent.appendChild(div);
        this.addViewModel = this.addViewModel.bind(this)
        this.removeViewModel = this.removeViewModel.bind(this)
        this.updateViewModel = this.updateViewModel.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this._onUnSelect = this._onUnSelect.bind(this)
        this._onSelectEnd = this._onSelectEnd.bind(this)
        this._onSelectMove = this._onSelectMove.bind(this) 
        this.onMouseUp = this.onMouseUp.bind(this)
        this.onSizeMove = this.onSizeMove.bind(this)
        this.onSizeChange = this.onSizeChange.bind(this)
        this.onOperationUpdate = this.onOperationUpdate.bind(this);
        this.onDbClick = this.onDbClick.bind(this);
        this.onPositionStart = this.onPositionStart.bind(this)
        this._onPositionStart = this._onPositionStart.bind(this)
        this._mutation.registerSelectCallbacks(
            this.onPositionStart,
            // this.onPositionStart,
            this._onPositionStart,
            this._onSelectMove,
            this._onSelectEnd) //todo 需要感知点击的坐标，保证蒙层可以在点击之后能够移动，实现不够优雅，待优化

        // this.onSizeStart = this.onSizeStart.bind(this)
    }
    _onPositionStart(data:{x:number,y:number}){
        const {x,y} = data;
        this._startX = x;
        this._startY = y;
        this._originX = x;
        this._originY = y;
    }
    registerShortcut(key:string,fn:any,params?:any[]){
        this.registerShortcuts([key],fn,params);
    }
    registerShortcuts(keys:string[],fn:any,params?:any[]){
        this._keyboard.registerShortcut(keys,{
            context:this,
            fn,
            params
        })
    }
    registerShiftShortcut(key:string,fn:any,params?:any[]){
        this._keyboard.registerShortcut([KeyBoardKeys.SHIFTKEY,key],{
            context:this,
            fn,
            params
        })
    }
    setUpKeyboard(){
        this.registerShortcut(KeyBoardKeys.ARROWLEFT,this.changePosition,[-MOVE_UNIT,0])
        this.registerShortcut(KeyBoardKeys.ARROWUP,this.changePosition,[0,-MOVE_UNIT])
        this.registerShortcut(KeyBoardKeys.ARROWRIGHT,this.changePosition,[MOVE_UNIT,0])
        this.registerShortcut(KeyBoardKeys.ARROWDOWN,this.changePosition,[0,MOVE_UNIT])
        this.registerShiftShortcut(KeyBoardKeys.ARROWLEFT,this.changePosition,[-SHITF_MOVE_UNIT,0])
        this.registerShiftShortcut(KeyBoardKeys.ARROWUP,this.changePosition,[0,-SHITF_MOVE_UNIT])
        this.registerShiftShortcut(KeyBoardKeys.ARROWRIGHT,this.changePosition,[SHITF_MOVE_UNIT,0])
        this.registerShiftShortcut(KeyBoardKeys.ARROWDOWN,this.changePosition,[0,SHITF_MOVE_UNIT])
        this.registerShortcut(KeyBoardKeys.BACKSPACE,this.removeSelectedModels);
        this.registerShortcuts([KeyBoardKeys.METAKEY,'g'],this.group);
        this.registerShortcuts([KeyBoardKeys.METAKEY,KeyBoardKeys.SHIFTKEY,'g'],this.unGroup);
    }
    group(){
        this._mutation.group(this._selectViewModels,this._pos);
    }
    unGroup(){
        this._mutation.unGroup(this._selectViewModels);
    }
    removeSelectedModels(){
        this._mutation.removeModels(this._selectViewModels);
    }
    _onSelectEnd(data:{x:number,y:number}){
        this._onUnSelect(data);
        this._keyboard.focus({
            preventScroll:true //阻止因为获取焦点导致画板上移
        });  
    }
    _onSelectMove(data:{x:number,y:number}){
        if(data == null) return;
        const {x,y} = data;
        // const pos = this._pos;
        const diffx = x - this._startX;
        const diffy = y - this._startY;
        if(Math.abs(diffx) < MIN_MOVE_DISTANCE && Math.abs(diffy) < MIN_MOVE_DISTANCE) return;
        this._changed = true;
        this._size && this._size.hide();
        // pos.left += diffx;
        // pos.top += diffy;
        this._startX = x;
        this._startY = y;
        if(this._pos){
            this._pos.moveLeftAndTop(diffx,diffy);
            this.setStyle();
        }
        this._selectViewModels.forEach((vm)=>{
            vm.changePosition(diffx,diffy)
        })
        if(this._showMakerTmId){
            clearTimeout(this._showMakerTmId);
            this.showMakers();
        }else{
            this._showMakerTmId = setTimeout(()=>{ //为了防止点击触发标注展示
                this.showMakers();
            },50)
        }
    }
    _onUnSelect(data:{x:number,y:number}){
        if(this._changed){
            this._size && this._size.show();
            this._mutation.onPostionChanges({
                vms:this._selectViewModels,
                data:{
                    left:this._startX - this._originX,
                    top: this._startY - this._originY
                }
            })
        }
        this.hideMakers()
    }
    changePosition(diffx:number,diffy:number){
        if(this._selectViewModels == null || this._selectViewModels.length === 0) return;
        const {_pos} = this;
        _pos.left += diffx;
        _pos.top += diffy;
        this.showMakers();

        this._mutation.onPostionChanges({
            vms:this._selectViewModels,
            data:{
                top:diffy || 0,
                left:diffx || 0
            }
        })
        this._hideMakerTmId = setTimeout(()=>{
            this.hideMakers();
        },500)
    }
    onSizeMove(diffX:number,diffY:number,direct:HANDLER_ITEM_DIRECTION){
        const target = HANDLER_ITEM_DIRECTION_HANDLER_MAP[direct] as string;
        this.eachSelect((vm:IViewModel)=>{
            vm.changeRect(target,diffX,diffY);
            //@ts-ignore
            this._pos[target](diffX,diffY);
        })
        if(this._showMakerTmId){
            clearTimeout(this._showMakerTmId);
            this.showMakers();
        }else{
            this._showMakerTmId = setTimeout(()=>{ //为了防止点击触发标注展示
                this.showMakers();
            },50)
        }
    }
    onSizeChange(){// todo 有BUG
        this._mutation.changePosAndSize(this._selectViewModels)
        if(this._showMakerTmId){
            clearTimeout(this._showMakerTmId);
            this._showMakerTmId = null
        }
        this.hideMakers()
    }
    setRootViewModel(vm:IViewModel){
        this._rootViewModel = vm;
    }
    eachRootViewModel(fn:(ret:any,vm:IViewModel)=>any,defaultVal?:any){
        return eachViewModel(this._rootViewModel,fn,defaultVal);
    }
    eachRootViewModelExcludeSelected(fn:(ret:any,vm:IViewModel)=>any,defaultVal?:any){
        return eachViewModelExcludeSelected(this._selectViewModels,this._rootViewModel,fn,defaultVal);
    }
    onOperationUpdate(){
        this.setStyle(); 
        if(this._size){
            this._size.setStyle(this._pos);
        }
    }
    addViewModel(viewModel:IViewModel){
        this._mutation.addViewModel(viewModel);
        // this._viewModelMap.set(encode(viewModel.getModel()._keyPath),viewModel);
    }
    removeViewModel(viewModel:IViewModel){
        this._mutation.removeViewModel(viewModel);
        // this._viewModelMap.delete(encode(viewModel.getModel()._keyPath))
    }
    updateViewModel(preId:string,curVm:IViewModel){
        const {_mutation} = this;
        const preVm = _mutation.getViewModel(preId);
        if(preVm === curVm){
            this._mutation.removeViewModelById(preId); //移除掉ID跟当前VM的关联记录
        }
        this._mutation.addViewModel(curVm);
    }
    destroy(){
        this._root.removeEventListener(CanvasEvent.MOUSEDOWN,this.onMouseDown)
        document.body.removeEventListener(CanvasEvent.MOUSEMOVE,this.onMouseMove)
        document.body.removeEventListener(CanvasEvent.MOUSEUP,this.onMouseUp)
        document.body.removeEventListener(CanvasEvent.MOUSELEAVE,this.onMouseUp);
        document.body.removeEventListener(CanvasEvent.DBCLICK,this.onDbClick)
        this._keyboard.destroy()
    }
    listen(){
        this._root.addEventListener(CanvasEvent.MOUSEDOWN,this.onMouseDown)
        document.body.addEventListener(CanvasEvent.MOUSEMOVE,this.onMouseMove)
        document.body.addEventListener(CanvasEvent.MOUSEUP,this.onMouseUp)
        document.body.addEventListener(CanvasEvent.MOUSELEAVE,this.onMouseUp);
        document.body.addEventListener(CanvasEvent.DBCLICK,this.onDbClick)
        this.setUpKeyboard();
    }
    update(){
        // const arr:IViewModel[] = [];
        // this._mutation.reduceSelectedKeyPath((keyPath:string)=>{
        //     const item = this._viewModelMap.get(keyPath);
        //     if(item){
        //         arr.push(item)
        //     }
        // })
        const arr:IViewModel[] = this._mutation.getAllSelectedViewModels()
        const artboards = arr.filter((vm)=>{
            return modelIsArtboard(vm.modelType);
        })
        let isArtboard:boolean = false;
        // console.log('artboards :',artboards);
        if(artboards.length > 0){
            this._selectViewModels = artboards;
            isArtboard = true;
        }else{
            this._selectViewModels = arr;
        }
        this.calculate(this._selectViewModels,isArtboard);
    }
    calculate(viewModels:IViewModel[],isArtboard:boolean){
        if(viewModels == null || viewModels.length === 0){
            this._root.style.display = 'none'
            this._pos = null
            if(this._size){
                this._size.destroy();
                this._size = null;
            }
            return;
        }
        const allRects:OperationPos[] = []
        for(let i = 0 ; i < viewModels.length; i++){
            const vm = viewModels[i];
            // if(!modelIsArtboard(vm.modelType)){
                allRects.push(vm.getRect())
            // }
        }
        const pos = calculateIncludeRect(allRects)
        this._pos = new OperationPos(pos.left,pos.top,pos.width,pos.height,this.onOperationUpdate);
        this.setStyle();
        if(this._size == null){
            this._size = new Size(this._root,this._pos,{
                onMove:this.onSizeMove,
                onChange:this.onSizeChange,
                noNeedOperation:isArtboard
                // onStart:this.onSizeStart
            });
        }else{
            this._size.update(this._pos,isArtboard)
        }
    }
    eachSelect(fn:(vm:IViewModel)=>void){
        this._selectViewModels.forEach(fn);
    }
    
    setStyle(){
        const pos = this._pos;
        this._root.setAttribute('style',`display:block;left:${pos.left}px;top:${pos.top}px;width:${pos.width}px;height:${pos.height}px`)
    }
    onPositionStart(data:{x:number,y:number}){
        this._canMove = true
        this._changed = false
        // console.log('mouse downed!!!');
        this._onPositionStart(data);
    }
    onDbClick(e:MouseEvent){
        const {x,y} = e;
        const {_selectViewModels} = this
        if(_selectViewModels == null || _selectViewModels.length === 0) return;
        for(let i = 0 ; i < _selectViewModels.length; i++){
            const vm = _selectViewModels[i];
            const target = vm.getViewModelByXY(x,y);
            if(target){
                this._mutation.onSelected({
                    vm:target,
                    data:{
                        needKeep:false,
                    x,
                    y,
                    noTrigger:true
                    }
                })
                this._canMove = false;
                this._changed = false;
                return;
            }
        }
    }
    onMouseDown(e:MouseEvent){
        const {x,y} = e;
        this.onPositionStart({x,y})
        // this.onFocus(e);
        e.stopPropagation()
    }
    
    onMouseMove(e:MouseEvent){
        if(!this._canMove ) return;
        // console.log('in moving!!!');
        // if(!this._canMove || this._pos == null) return;
        
        const {x,y} = e;
        this._onSelectMove({
            x,y
        })
    }
    onMouseUp(e:MouseEvent){
        if(this._canMove === false) return;
        this._canMove = false;
        this._onUnSelect(null);
    }
    showMakers(){
        this._showMakerTmId = null;
        if(this._hideMakerTmId != null){
            clearTimeout(this._hideMakerTmId);
            this._hideMakerTmId = null
        }
        const result = this.eachRootViewModelExcludeSelected(calculateLatestVm,{
            curPos:this._pos,
            selectModels:this._selectViewModels,
            data:[]
        })
        const {alignMap,data} = result;
        if(alignMap == null || data == null) return;
        const {updateMakers} = this._options 
        updateMakers([].concat(
            transformCalculateItem2MarkerData(this._pos,data),
            transformAliItem2MarkerData(alignMap)
        ));
    }
    hideMakers(){
        const {updateMakers} = this._options 
        if(this._showMakerTmId){
            clearTimeout(this._showMakerTmId)
            this._showMakerTmId = null;
        }
        updateMakers() 
    }
    disableMove(){
        this._canMove = false;
    }
}