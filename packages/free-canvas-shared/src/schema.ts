



export interface JSON_ROOT_SCHEMA { 
    $schema:string
    definitions:Object 
    properties:JSON_PROPERTY_TYPE
    type:JSON_PROPERTY_TYPES
    required:Array<JSON_PROPERTY_KEY>
} 

export type JSON_PROPERTY_KEY = keyof JSON_PROPERTY_TYPE

export enum JSON_PROPERTY_TYPES { 
    string = "string",
    number = "number",
    boolean = "boolean",
    object = "object",
    array = "array"
}



export type JSON_PROPERTY_VALUE_TYPE = JSON_STRING_SCHEMA |
 JSON_NUMBER_SCHEMA  | 
 JSON_BOOLEAN_SCHEMA |
 JSON_OBJECT_SCHEMA  |
 JSON_ARRAY_SCHEMA

 export interface JSON_PROPERTY_TYPE {
    [key:string]:JSON_PROPERTY_VALUE_TYPE
}

// export interface JSON_BASE_SCHEMA {
//     _keyPath:string
// }

export interface JSON_STRING_SCHEMA {
    description:string
    title:string
    type:JSON_PROPERTY_TYPES
    format?:string 
}

export interface JSON_NUMBER_SCHEMA {
    description:string
    title:string
    type:JSON_PROPERTY_TYPES
    format?:string
}

export interface JSON_BOOLEAN_SCHEMA {
    description:string
    title:string
    type:JSON_PROPERTY_TYPES
    format?:string
}

export interface JSON_OBJECT_SCHEMA {
    description:string
    title:string
    properties:JSON_PROPERTY_TYPE
    type:JSON_PROPERTY_TYPES
    required:Array<JSON_PROPERTY_KEY> 
}


export interface JSON_ARRAY_ITEMS_SCHEMA{ 
    [key:string]:JSON_PROPERTY_VALUE_TYPE
}

export interface JSON_ARRAY_SCHEMA {
    description:string
    title:string
    maxItems:number
    minItems:number
    type:JSON_PROPERTY_TYPES
    items:JSON_ARRAY_ITEMS_SCHEMA
    required:Array<JSON_PROPERTY_KEY>
}


