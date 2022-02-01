import { FormController, Str, EmailValidator, EqualWith, FormCreator } from "./index";

const create = new FormCreator(() => ({
    fields: {
        aa: Str(true)
    }
}))

const form = new FormController({
    fields: {
        email: Str(true),
        password: Str(true),
        confirm: Str(true)
    },
    validators: {
        email: EmailValidator(),
        confirm: EqualWith("password")
    },
    submit: (data) => new Promise(resolve => {
        setTimeout(() => {
            resolve({
                email: "ERROR"
            })
        }, 1000);
    })
})

form.change("email", "aa@aa.aa")
form.change("password", "aa@aa.aa")
form.set("confirm", "2")
form.set("confirm", "aa@aa.aa")

console.log(form.getValues())
form.clear()
console.log(form.getValues())