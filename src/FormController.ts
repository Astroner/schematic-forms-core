import { All, FType2type } from "./FieldTypes"
import { StoreType, GuardFunction, ValidatorFunction, ControllerConfig, Errors as Errs } from "./types";
import { RequiredValidator, combineValidators } from "./Validators";
import { combineGuards, getDefaultGuard } from "./Guards";
import { ValueStorage } from "./Models/ValueStorage";
import { Errors } from "./Models/Errors";
import { AdvancedObservable } from "./Models/AdvancedObservable";

export class FormController<FieldsTypes extends { [key: string]: All }, SubmitArgs extends any[]>{

    /**@description form values */
    private values: ValueStorage<FieldsTypes>

    /** @description type guards (Guards returns Error instance or passing value) */
    private guards: Map<string, GuardFunction<any>> = new Map();

    /** @description fields validators(Validators return Error instance or nothing) */
    private validators: Map<string, ValidatorFunction<any, Partial<StoreType<FieldsTypes>>>> = new Map();

    private pending: boolean = false;
    private pendingObservable = new AdvancedObservable<{ pending: boolean }>()

    private submitObservable = new AdvancedObservable<StoreType<FieldsTypes>>();

    public errors = new Errors<FieldsTypes>();
    
    constructor(
        private config: ControllerConfig<FieldsTypes, SubmitArgs>
    ) {
        /*creating storage */
        this.values = new ValueStorage(config.fields);

        /** iterating fields, saving validators and guards */
        for (let key in config.fields) {
            const cur = config.fields[key];

            if (config.guards && config.guards[key]) {
                const def = getDefaultGuard(cur);
                const setted = config.guards[key];
                if (def) {
                    this.guards.set(key, combineGuards(def, setted))
                } else if(setted){
                    this.guards.set(key, setted as any)
                }
            } else {
                const def = getDefaultGuard(cur);
                if (def) this.guards.set(key, def)
            }

            if (config.fields[key].required) {
                if (config.validators && config.validators[key]) {
                    this.validators.set(key, combineValidators(
                        RequiredValidator,
                        config.validators[key] as any
                    ))
                } else {
                    this.validators.set(key, RequiredValidator)
                }
            } else {
                if (config.validators && config.validators[key]) {
                    this.validators.set(key, config.validators[key] as any)
                }
            }
        }
    }

    /**
     * 
     * @param name field name
     * @param value field value
     * 
     * @description sets single value
     */
    set<K extends keyof FieldsTypes>(name: K, value: FType2type<FieldsTypes[K]>) {
        this.change(name as string, value);
    }

    /**
     * 
     * @param name of field
     * 
     * @returns field value
     */
    get<K extends keyof FieldsTypes>(name: K): FType2type<FieldsTypes[K]> | undefined {
        return this.values.get(name)
    }

    isPending(){
        return this.pending
    }

    /**
     * @description clears the form
     */
    clear(){
        this.values.clear();
        this.errors.clear();
    }

    /**
     * 
     * @param name field name
     * @param value field value
     * 
     * @description sets single value(name and value untyped)
     */
    change(name: string, nextValue: any) {
        if (!(name in this.config.fields)) return
        let value = nextValue;

        const guard = this.guards.get(name);
        if (guard) {
            const guardResult = guard(value);
            if (guardResult instanceof Error) {
                return console.error(guardResult.message)
            }
            value = guardResult;
        }
        const validator = this.validators.get(name);
        if (validator) {
            const result = validator(value, this.values.getState());
            if (result instanceof Error) {
                this.errors.set(name, result.message)
            } else {
                this.errors.remove(name)
            }
        }

        this.values.set(name, value)
    }

    /**
     * @returns stored values
     */
    getValues() {
        return this.values.getState();
    }

    /**
     * @description checks form validation and execute submit() function from config
     * 
     * @returns void if successed and errors map if failed 
     */
    submit(...arg: SubmitArgs): void | Errs<FieldsTypes> {
        if (this.errors.size() > 0)
            return this.errors.getState();

        const state = this.values.getState();
        const errors: Errs<FieldsTypes> = {};

        for (let key in this.config.fields) {
            const validator = this.validators.get(key);
            if (!validator) continue
            const result = validator(state[key], state);
            if (result instanceof Error) {
                errors[key] = result.message
            }
        }
        if (Object.keys(errors).length > 0) {
            this.errors.setState(errors);
            return this.errors.getState();
        }
        this.submitObservable.update(state as any);
        if(!this.config.submit) return;
        
        const sub = this.config.submit(state as any, ...arg);

        if (!sub) return;

        if (sub instanceof Promise) {
            this.pending = true;
            this.pendingObservable.update({ pending: true })
            sub
                .then(res => {
                    if (!res) return
                    this.errors.setState(res)
                })
                .catch(console.error)
                .finally(() => {
                    this.pending = false;
                    this.pendingObservable.update({ pending: false })
                })
        } else {
            this.errors.setState(sub)
        }
    }

    /**
     * 
     * @param type what changes do u want to subscribe
     * @param cb callback
     */
    subscribe(type: "errors", cb: Parameters<Errors<FieldsTypes>["subscribe"]>[0]): ReturnType<Errors<FieldsTypes>["subscribe"]>
    subscribe(type: "submit", cb: Parameters<AdvancedObservable<StoreType<FieldsTypes>>['subscribe']>[0]): ReturnType<AdvancedObservable<StoreType<FieldsTypes>>['subscribe']>
    subscribe(type: "values", cb: Parameters<ValueStorage<FieldsTypes>["subscribe"]>[0]): ReturnType<ValueStorage<FieldsTypes>["subscribe"]>
    subscribe(type: "pending", cb: Parameters<AdvancedObservable<{ pending: boolean }>["subscribe"]>[0]): ReturnType<AdvancedObservable<{ pending: boolean }>["subscribe"]>
    subscribe(
        type: "errors" | "values" | "pending" | "submit",
        cb: 
            | Parameters<Errors<FieldsTypes>["subscribe"]>[0] 
            | Parameters<AdvancedObservable<StoreType<FieldsTypes>>['subscribe']>[0]
            | Parameters<ValueStorage<FieldsTypes>["subscribe"]>[0] 
            | Parameters<AdvancedObservable<{ pending: boolean }>["subscribe"]>[0]
    ): 
        | ReturnType<Errors<FieldsTypes>["subscribe"]> 
        | ReturnType<AdvancedObservable<StoreType<FieldsTypes>>['subscribe']>
        | ReturnType<ValueStorage<FieldsTypes>["subscribe"]> 
        | ReturnType<AdvancedObservable<{ pending: boolean }>["subscribe"]> 
    {
        if (type === "errors") return this.errors.subscribe(cb as any)
        else if (type === "pending") return this.pendingObservable.subscribe(cb as any)
        else if(type === "submit") return this.submitObservable.subscribe(cb as any)
        else return this.values.subscribe(cb as any)
    }
}