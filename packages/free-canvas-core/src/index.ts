
import Core from './core/index';
import {CoreOptions} from './core/type';


// const isInIframe = window.top !== window;

export default function(el:string,options:CoreOptions){
    let corOptions = options;
    // if(isInIframe){
    //     corOptions = Object.assign({

    //     })
    // }
    return new Core(el,corOptions); 
} 