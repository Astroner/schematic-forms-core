import { AdvancedObservable } from "./AdvancedObservable"
import { All, FType2type } from "../FieldTypes";
import { StoreType } from "../types";

export class ValueStorage<Fields extends { [key: string]: All}> {
    private subs = new AdvancedObservable<Partial<StoreType<Fields>>>()
    private value: Partial<StoreType<Fields>> = {};
    private initialValue: Partial<StoreType<Fields>> = {};

    constructor(
        fields: Fields
    ) {
        for (let key in fields) {
            if (fields[key].default) this.value[key] = fields[key].default;
            else if (fields[key].type === "string") this.value[key] = "" as any;
            else if (fields[key].type === "number") this.value[key] = "" as any;
        }

        this.initialValue = { ...this.value };
    }

    set<K extends keyof Fields>(name: K, value: FType2type<Fields[K]>) {
        this.value[name] = value;
        this.subs.update(this.value)
    }

    get<K extends keyof Fields>(name: K): FType2type<Fields[K]> | undefined {
        return this.value[name]
    }

    getState(): Partial<StoreType<Fields>> {
        return this.value;
    }

    clear(){
        this.value = this.initialValue;
        this.subs.update(this.value)
    }
    
    subscribe: AdvancedObservable<Partial<StoreType<Fields>>>["subscribe"] = this.subs.subscribe.bind(this.subs)
}