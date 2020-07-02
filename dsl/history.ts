// type CallbackFunction = (preState: any, nextState: any) => void;

export interface HistoryApi {
    undo(): any;
    redo(): any;
    subscribe(callback: CallbackFunction): () => void;
  }
  
  export interface CallbackFunction {
    (preState: any, nextState: any): void;
  }
  
  export interface HistoryOptions {
    limit: number;
  }
  
  
  
  const DefaultLimit: number = 200;
  
  export default class History implements HistoryApi {
  
    /* 长度限制 */
    limit: number;
    /* undo记录栈 */
    historyStack: any[];
    /* redo记录 */
    futureStack: any[];
    /* 当前状态 */
    currentState: any;
    /* 侦听器 */
    private listeners: CallbackFunction[];
  
    
    /*
    * 构造函数
    * @param initState 初始化数字局
    * @param options 配置信息
    */
    constructor (initState: any, options?: HistoryOptions) {
      options = options || {limit: DefaultLimit};
      this.limit = options.limit;
      this.historyStack = [];
      this.futureStack = [];
      this.currentState = initState;
      this.listeners = [];
    }
    /* 
    * 添加历史记录
    * @param state 
    */
    push(state: any) {
      this.futureStack = [];
      let latestState = this.currentState;
      this.overflowLimit(this.historyStack).push(latestState);
      this.currentState = state;
      this.triggerEvent(state, latestState);
      return state;
    }
    clear() {
      this.futureStack = [];
      this.historyStack = [];
      return this.currentState;
    }
    /*
    * 撤销操作
    */
    undo() {
      if (this.historyStack.length > 0) {
        let nextState = this.historyStack.pop();
        let latestState = this.currentState;
        this.overflowLimit(this.futureStack).push(latestState);
        this.currentState = nextState;
        this.triggerEvent(nextState, latestState);
      }
      return this.currentState;
    }
    /* 
    * 重做
    */
    redo() {
      if (this.futureStack.length > 0) {
        let prevState = this.futureStack.pop();
        let latestState = this.currentState;
        this.overflowLimit(this.historyStack).push(latestState);
        this.currentState = prevState;
        this.triggerEvent(prevState, latestState);
      }
      return this.currentState;
    }
    /*
    * 所有历史记录
    */ 
    list() {
      return [
        ...this.historyStack
      ]
    }
    /*
    * 历史记录长度
    */
    length() {
      return this.historyStack.length;
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