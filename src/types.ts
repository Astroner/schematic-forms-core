import { FType2type, All } from "./FieldTypes"

export type Errors<FieldTypes extends { [key: string]: any }> = {
    [K in keyof FieldTypes]?: string
}
export type StoreType<FileldsTypes extends { [key: string]: All }> = {
    [K in keyof FileldsTypes]: FType2type<FileldsTypes[K]>
}

export type ValidatorFunction<T, FT> = (value: T, store: FT) => void | Error
export type Validator<FileldsTypes extends { [key: string]: All }> = {
    [K in keyof FileldsTypes]?: ValidatorFunction<FType2type<FileldsTypes[K]>, Partial<StoreType<FileldsTypes>>>
}

export type GuardFunction<RT> = (value: any) => RT | Error
export type Guards<FileldsTypes extends { [key: string]: All }> = {
    [K in keyof FileldsTypes]?: GuardFunction<FType2type<FileldsTypes[K]>>
}


export type ControllerConfig<FileldsTypes extends { [key: string]: All }, SubmitArg extends any[]=void[]> = {
    fields: FileldsTypes
    validators?: Validator<FileldsTypes>
    guards?: Guards<FileldsTypes>
    submit?: (store: StoreType<FileldsTypes>, ...args: SubmitArg) => void | Errors<FileldsTypes> | Promise<void | Errors<FileldsTypes>>
}
