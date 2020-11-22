import { FormController, Str, EmailValidator, EqualWith } from "./index";

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

form.subscribe("pending", ({ pending }) => console.log(`Pending: ${pending}`))
form.subscribe("errors", console.log)

form.change("email", "aa@aa.aa")
form.change("password", "aa@aa.aa")
form.set("confirm", "2")
form.set("confirm", "aa@aa.aa")

form.submit()