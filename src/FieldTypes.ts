export type StringType = {
    type: "string"
    required: false,
    default?: string
}

export type StringTypeRequired = {
    type: "string"
    required: true,
    default?: string
}

export type NumberType = {
    type: "number",
    required: false,
    default?: number
}

export type NumberTypeRequired = {
    type: "number",
    required: true,
    default?: number
}

export type BooleanType = {
    type: "boolean",
    required: false,
    default?: boolean
}

export type BooleanTypeRequired = {
    type: "boolean",
    required: true,
    default?: boolean
}

export type EnumType<Variants extends Array<any>> = {
    type: "enum",
    required: false,
    variants: Variants,
    default?: Variants[number]
}

export type EnumTypeRequired<Variants extends Array<any>> = {
    type: "enum",
    required: true,
    variants: Variants,
    default?: Variants[number]
}

export type FileType = {
    type: "file",
    required: false,
    default?: File
}

export type FileTypeRequired = {
    type: "file",
    required: true,
    default?: File
}

export type ObjectType<ObjectType extends { [key: string]: All}> = {
    type: "object"
    required: false,
    fields: ObjectType,
    default?: ExtractTypes<ObjectType>
}
export type ObjectTypeRequired<ObjectType extends { [key: string]: All}> = {
    type: "object"
    required: true,
    fields: ObjectType,
    default?: ExtractTypes<ObjectType>
}


export type ArrayType<P extends All> = {
    type: "array"
    required: false,
    consistsOf: P
    default?: Array<FType2type<P>>
}
export type ArrayTypeRequired<P extends All> = {
    type: "array"
    required: true,
    consistsOf: P
    default?: Array<FType2type<P>>
}

export type MixedType<Types extends All[]> = {
    type: "mixed"
    required: false,
    mix: Types,
    default?: FType2type<Types[number]>
}
export type MixedTypeRequired<Types extends All[]> = {
    type: "mixed"
    required: true,
    mix: Types,
    default?: FType2type<Types[number]>
}

export type NullType = {
    type: "null",
    required: boolean,
    default?: null
}

export type AnyType<DataType> = {
    type: "any"
    required: false
    default?: DataType 
}
export type AnyTypeRequired<DataType> = {
    type: "any"
    required: true
    default?: DataType
}

// Do not forget to add new types in All enum
export type All = 
                StringType | StringTypeRequired | 
                NumberType | NumberTypeRequired | 
                BooleanType | BooleanTypeRequired | 
                EnumType<any[]> | EnumTypeRequired<any[]> |
                FileType | FileTypeRequired |
                ObjectType<any> | ObjectTypeRequired<any> |
                ArrayType<any> | ArrayTypeRequired<any> |
                MixedType<any[]> | MixedTypeRequired<any[]> |
                NullType |
                AnyType<any> | AnyTypeRequired<any>

//Do not forget to add new types in FType2type transform type
export type FType2type<T extends All> = 
            T extends StringType ? string | undefined :
            T extends StringTypeRequired ? string :
            T extends NumberType ? number | undefined : 
            T extends NumberTypeRequired ? number : 
            T extends BooleanType ? boolean | undefined : 
            T extends BooleanTypeRequired ? boolean : 
            T extends FileType ? File | undefined  :
            T extends FileTypeRequired ? File :
            T extends EnumType<any> ? T["variants"][number] | undefined : 
            T extends EnumTypeRequired<any> ? T["variants"][number] : 
            T extends ObjectType<any> ? ExtractTypes<T["fields"]> | undefined :
            T extends ObjectTypeRequired<any> ? ExtractTypes<T["fields"]> :
            T extends ArrayType<any> ? Array<FType2type<T["consistsOf"]>> | undefined :
            T extends ArrayTypeRequired<any> ? Array<FType2type<T["consistsOf"]>> :
            T extends MixedType<any[]> ? T["default"] :
            T extends MixedTypeRequired<any[]> ? Exclude<T["default"], undefined> :
            T extends NullType ? null :
            T extends AnyType<any> ? T["default"] :
            T extends AnyTypeRequired<any> ? Exclude<T["default"], undefined> :
            unknown

export type ExtractTypes<T extends { [key: string]: All }> = {
    [K in keyof T]: FType2type<T[K]>
}