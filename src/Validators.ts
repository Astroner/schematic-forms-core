import { FormController } from "./FormController"
import { ValidatorFunction } from "./types"

export const RequiredValidator: ValidatorFunction<any, any> = (value: any) => {
    if (!Boolean(value)) return new Error("REQUIRED")
}

export const combineValidators = <ValueType, StoreType>(
    ...args: ValidatorFunction<any, any>[]
): ValidatorFunction<ValueType, StoreType> => {
    return (arg: ValueType, store: StoreType) => {
        for (let validator of args){
            const result = validator(arg, store);
            if(result instanceof Error){
                return result
            }
        }
    }
}

export const NumberFilter = (arg: { gte?: number, lte?: number }): ValidatorFunction<number | undefined, any> => (value) => {

    if (!value && value !== 0) return
    
    if(arg.gte){
        if(value <= arg.gte) return new Error(`SHOULD_BE_GREATER`)
    }
    if(arg.lte){
        if (value >= arg.lte) return new Error(`SHOULD_BE_LESSER`)
    }
}

/**
 * 
 * @param errorMessage error code (default: NOT_VALID_EMAIL)
 * @description field validator for email
 */
export const EmailValidator = (errorMessage: string = "NOT_VALID_EMAIL"): ValidatorFunction<string | undefined, any> => (value) => {
    if(!value) return
    if (validate(value)) return
    else return new Error(errorMessage)
}

/**
 * 
 * @param errorMessage error code (default: NOT_VALID_PHONE_NUMBER)
 * @description field validator for phone numbers
 */
export const PhoneValidator = (errorMessage: string = "NOT_VALID_PHONE_NUMBER"): ValidatorFunction<string | undefined, any> => (value) => {
    if (!value) return
    if (validatePhone(value)) return
    else return new Error(errorMessage)
}

const validate = (email: string): boolean => {
    var re: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const validatePhone = (tel: string): boolean => {
    //eslint-disable-next-line
    const regExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    return regExp.test(tel)
}

export const EqualWith = <
    ControllerType extends FormController<any, any>, 
    ValueType
>(
    key: keyof ReturnType<ControllerType["getValues"]>, 
    errorKey: string = "EQUAL_VALIDATOR_ERROR"
): ValidatorFunction<ValueType | undefined, ReturnType<ControllerType["getValues"]>> => 
(value, store) => {
    if(!value) return
    if(value !== store[key]) return new Error(errorKey)
}