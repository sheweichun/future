

import React from 'react'

export  const GlobalContextValue = {
    
}
export const GlobalContext = React.createContext(GlobalContextValue) 


// export function<T  extends ContextType>(context:React.Context<T>){
//     ComponentClz.contextType = context;
//     return ComponentClz;
// }