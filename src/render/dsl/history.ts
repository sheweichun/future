
import {CallbackFunction} from './type';
export interface HistoryApi {
    undo(): any;
    redo(): any;
    subscribe(callback: CallbackFunction): () => void;
}

export interface HistoryOptions {
    limit?: number;
}



const DefaultLimit: number = 200;

export class History implements HistoryApi {

    /* 长度限制 */
    limit: number;
    /* 记录栈 */
    recordStack: any[];
    /* 当前状态指针 */
    currentIndex: number;

    /* 当前状态 */
    get currentState(){
        return this.recordStack[this.currentIndex];
    }
    /* 侦听器 */
    private listeners: CallbackFunction[];


    /*
    * 构造函数
    * @param initState 初始化数字局
    * @param options 配置信息
    */
    constructor (initState: any, options?: HistoryOptions) {
        options = options || {limit: DefaultLimit};
        this.limit = options.limit || DefaultLimit;
        this.currentIndex = 0;
        this.recordStack = initState == null ? [] : [initState];
        this.listeners = [];
    }
    /* 
    * 添加历史记录
    * @param state 
    */
    push(state:any) {
        const prevState = this.currentState;
        this.recordStack.splice(this.currentIndex + 1);
        this.overflowLimit(this.recordStack).push(state);
        this.currentIndex = this.recordStack.length - 1;
        this.triggerEvent(state, prevState);
        return state;
    }

    replace(state:any){
        const prevState = this.currentState;
        // const startIndex = this.currentIndex + 1;
        // this.recordStack.splice(startIndex, this.recordStack.length - 1, state);
        this.recordStack.splice(this.currentIndex, 1, state);
        
        this.triggerEvent(state, prevState);
        return state;
    }

    clear() {
        this.recordStack = [];
        return this.currentState;
    }
    /*
    * 撤销操作
    */
    undo() {
        const nextState = this.currentState;
        if (this.currentIndex <= 0) return
        this.currentIndex--;
        this.triggerEvent(this.currentState,nextState);
        return this.currentState;
    }
    /* 
    * 重做
    */
    redo() {
        const prevState = this.currentState;
        if (this.currentIndex >= this.recordStack.length - 1) return
        this.currentIndex ++;
        this.triggerEvent(this.currentState, prevState);
        return this.currentState;
    }
    /*
    * 所有历史记录
    */ 
    list() {
        return [
        ...this.recordStack
        ]
    }
    /*
    * 历史记录长度
    */
    length() {
        return this.recordStack.length;
    }
    subscribe(listener: CallbackFunction) {
        this.listeners.push(listener);
        return () => {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        }
    }
    triggerEvent(currentState: any, prevState: any) {
        this.listeners.forEach(listener => {
            listener(currentState, prevState);
        })
    }
    private overflowLimit(stack: any[]) {
        if (stack.length >= this.limit) {
            stack.shift();
        }
        return stack;
    }

}