
import Core,{CoreOptions} from './core/index';


export default function(el:string,options:CoreOptions){
    console.log('hello');
    return new Core(el,options); 
} 