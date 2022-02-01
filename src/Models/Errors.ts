import { All } from "../FieldTypes";
import { Errors as Errs } from "../types";
import { AdvancedObservable } from "./AdvancedObservable";

export class Errors<Fields extends { [key: string]: All }> {
    private value: Errs<Fields> = {};
    private subs: AdvancedObservable<Errs<Fields>> = new AdvancedObservable();
    
    size(): number {
        return Object.keys(this.value).length
    }

    set<K extends keyof Fields>(name: K, error: string) {
        this.value[name] = error;
        this.subs.update(this.value)
    }

    remove<K extends keyof Fields>(name: K) {
        if (name in this.value) {
            delete this.value[name];
            this.subs.update(this.value)
        }
    }

    setState(errs: Errs<Fields>) {
        const toSet: Errs<Fields> = { ...errs };
        for (let key in toSet) {
            if (!toSet[key]) {
                delete toSet[key]
            }
        }
        this.value = toSet;
        this.subs.update(this.value)
    }

    getState(){
        return this.value
    }

    clear(){
        this.value = {};
        this.subs.update(this.value)
    }

    subscribe: AdvancedObservable<Errs<Fields>>["subscribe"] = this.subs.subscribe.bind(this.subs)
}