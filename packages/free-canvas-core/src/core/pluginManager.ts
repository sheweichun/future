import {IPlugin,ICommander,IPluginManagerOptions} from 'free-canvas-shared'
export class PluginManager{
    private _plugins:IPlugin[] = []
    constructor(private _commander:ICommander,private _options:IPluginManagerOptions){}
    install(plugin:IPlugin){
        if(plugin == null) return;
        plugin.install(this._commander,this._options);
        this._plugins.push(plugin);
    }
    uninstall(plugin:IPlugin){ 
        if(plugin == null) return;
        const index = this._plugins.indexOf(plugin);
        if(index >= 0){
            plugin.destroy();
            this._plugins.splice(index,1);
        }
    }
    destroy(){
        this._plugins.forEach((plugin:IPlugin)=>{
            plugin.destroy()
        })
    }
}