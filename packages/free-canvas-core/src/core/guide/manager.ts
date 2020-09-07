


import {GuideManagerOptions} from './type'
import {VGuide,HGuide,Guide} from './guide'
import {completeOptions} from '../../utils/index'

const DEFAULT_OPTIONS = {

}

export class GuideManager{
    public hGuide:Guide
    public vGuide:Guide
    private _options:GuideManagerOptions
    constructor(private _rootEl:HTMLElement,options:GuideManagerOptions){
        this._options = completeOptions(options,DEFAULT_OPTIONS);
        // this._mount();
    }
    mount(){
        const {_rootEl,_options} = this
        this.hGuide = new HGuide(_rootEl,_options).mount().listen()
        this.vGuide = new VGuide(_rootEl,_options).mount().listen()
    }
    listen(){

    }
    addGuide(){

    }
    destroy(){
        this.hGuide.destroy()
        this.vGuide.destroy()
    }
}