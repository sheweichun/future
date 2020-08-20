export const inMemory = (initial , transition) => {
    let rootState = initial;
    // const read = () => initial;
    const read = () => rootState;
    const write = (fn , ...context) => {
      const oldState = rootState;
      const newState = fn(oldState);
      rootState = newState;  //必须放在transition前面,否则会导致历史状态中保留了最新状态值 触发bug
      transition(newState, oldState, ...context);
     

      return rootState; 
    };
    const clear = ()=> { 
      rootState = initial 
    }
    // const isChanged = ()=>{
    //   console.log(rootState === initial);
    // }
    return { read, write, clear};
  };
  
  // export const webStorage = (
  //   { type, key } : Object,
  //   initial : Object | void,
  //   transition : Function
  // ) => {
  //   const store = window[`${type}Storage`];
  //   if (initial !== undefined) {
  //     store.setItem(key, JSON.stringify(initial));
  //   }
  //   const read = () => JSON.parse(store.getItem(key));
  //   const write = (fn : Function, ...context : any) => {
  //     const oldState = read();
  //     const newState = fn(oldState);
  //     transition(newState, oldState, ...context);
  //     store.setItem(key, JSON.stringify(newState));
  //     return read();
  //   };
  //   return { read, write };
  // };