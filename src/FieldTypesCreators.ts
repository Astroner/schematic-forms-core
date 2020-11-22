import { 
    StringType, StringTypeRequired, 
    BooleanType, BooleanTypeRequired, 
    NumberType, NumberTypeRequired,
    FileType, FileTypeRequired, 
    EnumTypeRequired, EnumType,
    ExtractTypes, All,
    ObjectType, ObjectTypeRequired, 
    FType2type, 
    ArrayType, ArrayTypeRequired, 
    MixedTypeRequired, MixedType, NullType, AnyTypeRequired, AnyType
} from "./FieldTypes";

export function Str(required: true, defaultValue?: string): StringTypeRequired
export function Str(required?: false, defaultValue?: string): StringType
export function Str(required?: boolean, defaultValue?: string): StringType | StringTypeRequired{
    return {
        type: "string",
        required: Boolean(required),
        default: defaultValue
    }
}

export function Num(required: true, defaultValue?: number): NumberTypeRequired
export function Num(required?: false, defaultValue?: number): NumberType
export function Num(required?: boolean, defaultValue?: number): NumberType | NumberTypeRequired{
    return {
        type: "number",
        required: Boolean(required),
        default: defaultValue
    }
}
export function Bool(required: true, defaultValue?: boolean): BooleanTypeRequired
export function Bool(required?: false, defaultValue?: boolean): BooleanType
export function Bool(required?: boolean | null, defaultValue?: boolean): BooleanType | BooleanTypeRequired {
    return {
        type: "boolean",
        required: Boolean(required),
        default: defaultValue
    }
}

export function FileField(required: true, defaultValue?: File): FileTypeRequired
export function FileField(required?: false, defaultValue?: File): FileType
export function FileField(required?: boolean, defaultValue?: File): FileType | FileTypeRequired {
    return {
        type: "file",
        required: Boolean(required),
        default: defaultValue
    }
}

export function Enum<Variants extends any[]>(variants: Variants, required: true, defaultValue?: Variants[number]): EnumTypeRequired<Variants>
export function Enum<Variants extends any[]>(variants: Variants, required?: false, defaultValue?: Variants[number]): EnumType<Variants>
export function Enum<Variants extends any[]>(variants: Variants, required?: boolean, defaultValue?: Variants[number]): EnumTypeRequired<Variants> | EnumType<Variants>{
    return {
        type: "enum",
        variants,
        required: Boolean(required),
        default: defaultValue
    }
}

export function Obj<DataType extends {[key: string]: All }>(
    fields: DataType,
    required: true,
    defaultValue?: ExtractTypes<DataType>
): ObjectTypeRequired<DataType>
export function Obj<DataType extends { [key: string]: All }>(
    fields: DataType,
    required?: false,
    defaultValue?: ExtractTypes<DataType>
): ObjectType<DataType>
export function Obj<DataType extends { [key: string]: All }>(
    fields: DataType,
    required?: boolean,
    defaultValue?: ExtractTypes<DataType>
): ObjectType<DataType> | ObjectTypeRequired<DataType> {
    return {
        type: "object",
        fields,
        required: Boolean(required),
        default: defaultValue
    }
}


export function Arr<Children extends All>(
    childrenType: Children, 
    required: true, 
    defaultValue?: Array<FType2type<Children>>
): ArrayTypeRequired<Children>
export function Arr<Children extends All>(
    childrenType: Children,
    required?: false,
    defaultValue?: Array<FType2type<Children>>
): ArrayType<Children>
export function Arr<Children extends All>(
    childrenType: Children,
    required?: boolean,
    defaultValue?: Array<FType2type<Children>>
): ArrayType<Children> | ArrayTypeRequired<Children> {
    return {
        default: defaultValue,
        type: "array",
        consistsOf: childrenType,
        required: Boolean(required)
    }
}

export function Mix<Mixed extends All[]>(
    mixed: Mixed,
    required: true,
    defaultValue?: FType2type<Mixed[number]>
): MixedTypeRequired<Mixed>
export function Mix<Mixed extends All[]>(
    mixed: Mixed,
    required?: false,
    defaultValue?: FType2type<Mixed[number]>
): MixedType<Mixed>
export function Mix<Mixed extends All[]>(
    mixed: Mixed,
    required?: boolean,
    defaultValue?: FType2type<Mixed[number]>
): MixedTypeRequired<Mixed> | MixedType<Mixed> {
    return {
        default: defaultValue,
        type: "mixed",
        mix: mixed,
        required: Boolean(required)
    }
}

export function Null(): NullType {
    return {
        type: "null",
        required: false,
        default: null
    }
}

export function Any<DataType=undefined>(required: true, defaultValue?: DataType): AnyTypeRequired<DataType>
export function Any<DataType = undefined>(required?: false, defaultValue?: DataType): AnyType<DataType>
export function Any<DataType = undefined>(required?: boolean, defaultValue?: DataType): AnyTypeRequired<DataType> | AnyType<DataType> {
    return {
        type: "any",
        required: Boolean(required),
        default: defaultValue
    }
}