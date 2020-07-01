
import Core,{CoreOptions} from './core/index';


export default function(el:string,options:CoreOptions){
    return new Core(el,options);
}