import {JSON_ROOT_SCHEMA} from '@pkg/free-canvas-shared'
import {ObjectSchema,SchemaChangeType} from '@pkg/free-canvas-json-editor'

export interface JsonEditorProps{
    // value:any
    // data:JSON_ROOT_SCHEMA
    value:ObjectSchema
    onChange?:(val:ObjectSchema,type:SchemaChangeType)=>void
    // onInit?:(val:ObjectSchema)=>void
}

export interface JsonEditorState{
    // value?:ObjectSchema
}