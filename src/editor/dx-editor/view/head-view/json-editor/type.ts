import {ModelVo} from '@pkg/free-canvas-shared'

export interface JsonEditorProps{
    value?:ModelVo
    defaultValue?:ModelVo
    onChange?:(val?:ModelVo)=>void
}

export interface JsonEditorState{
    value?:string
}