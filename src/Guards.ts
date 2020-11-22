import { GuardFunction } from "./types";
import { All, FType2type } from "./FieldTypes";

const a = typeof("Asd"); 

type T = typeof a;

function createPlainGuard<Type>(type: T): GuardFunction<Type>{
    return (value: any) => {
        if(typeof value === type){
            return value
        }else{
            return new Error(`${value} is not assignable to type ${type}`);
        }
    }
}

export const StringGuard = createPlainGuard<string>("string")
export const BooleanGuard = createPlainGuard<boolean>("boolean")
export const NumberGuard: GuardFunction<number> = (value: any) => {
    const tempo = Number(value);
    if (Object.is(tempo, NaN)) return new Error(`'${value}' is not assignable to type number`)

    if (tempo < 0 ) return 0

    return tempo
}


export const FileGuard: GuardFunction<File> = (value: any) => {
    if(value instanceof File){
        return value
    }else{
        return new Error(`'${value}' is not a File instance`)
    }
}

export const createEnumGuard = <Variants extends any[]>(variants: Variants) => (value: any) => {
    if (variants.includes(value)) return value;
    else return new Error(`'${JSON.stringify(variants)}' doesn't includes ${value}`)
}

type GuardMap<Shape extends { [key: string]: All }> = {
    [K in keyof Shape]?: GuardFunction<FType2type<Shape[K]>> | void
}
export const createObjectGuard = <Shape extends { [key: string]: All }>(shape: Shape) => {

    const guards: GuardMap<Shape> = {};

    for(let key in shape) {
        guards[key] = getDefaultGuard(shape[key]);
    }  

    return (value: any) => {
        if (!value) return value;

        if (typeof value !== "object") return new Error(`${value} is not an object`);

        for (let key in shape) {
            if (!(key in value)) return new Error(`Prop ${key} is defined in schema, but it is not in value(${value})`)
            const guard = guards[key];

            if (guard) {
                const result = (guard as any)(value[key]);
                if (result instanceof Error) return result
            }
        }

        return value
    }
}

export const createArrayGuard = <P extends All>(childrenType: P) => {

    const guard = getDefaultGuard<any>(childrenType);

    return (value: any) => {
        if (!value) return value;

        if (!(value instanceof Array)) return new Error(`${value} is not instance of Array`);


        if (!guard) return value

        for (let val of value) {
            const result = guard(val);
            if (result instanceof Error) {
                return result
            }
        }

        return value
    }
}

export const createMixedGuard = <M extends All[]>(mix: M) => {

    const guards: ReturnType<typeof getDefaultGuard>[] = []
    let names: string[] = [];

    for(let type of mix){
        names.push(type.type);
        guards.push(getDefaultGuard(type))
    }

    let types = `[${names.join(", ")}]`

    return (value: any) => {
        if (!value) return value

        let val = value;

        for (let guard of guards){
            if(!guard) continue
            const result = guard(val);
            if (!(result instanceof Error)) {
                return result
            }
        }

        return new Error(`"${value}" is not assignable to types ${types}`)
    }
}

export const combineGuards = <GuardType>(
    ...args: Array<GuardFunction<GuardType> | null | undefined>
): GuardFunction<GuardType> => (value: any) => {
    let val = value;
    for(let validator of args){
        if(!validator) continue
        const result = validator(val);
        if(result instanceof Error){
            return result;
        }else{
            val = result;
        }
    }
    return val;
}

export const getDefaultGuard = <GuardType>(
    type: All
): GuardFunction<GuardType> | void => {
    switch(type.type){
        case "string": return StringGuard as any
        case "number": return NumberGuard as any
        case "boolean": return BooleanGuard as any
        case "enum": return createEnumGuard(type.variants) as any
        case "file": return FileGuard as any
        case "object": return createObjectGuard(type.fields) as any
        case "array": return createArrayGuard(type.consistsOf) as any
        case "mixed": return createMixedGuard(type.mix) as any
    }
}