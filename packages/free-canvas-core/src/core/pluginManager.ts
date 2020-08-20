import {IPlugin,ICommander,IPluginManagerOptions,Model,IMutation} from 'free-canvas-shared'
export class PluginManager{
    private _plugins:IPlugin[] = []
    private _modelData:Model
    private _selectedModels:Model[]
    constructor(private _commander:ICommander,private _mutation:IMutation,private _options:IPluginManagerOptions){
        this.updateData();
    }
    updateData(){
        this._modelData = this._mutation.getDSLData().searialize() as Model;
        this._selectedModels = this._mutation.getSelectedBaseModels(true) as Model[];
    }
    install(plugin:IPlugin){
        if(plugin == null) return;
        plugin.install(this._commander,this._mutation,this._options);
        this._plugins.push(plugin);
        plugin.update(this._modelData,this._selectedModels);

    }
    update():void{
        this.updateData();
        const { _modelData,_selectedModels } = this;
        this._plugins.forEach((plugin:IPlugin)=>{
            plugin.update(_modelData,_selectedModels);
        })
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