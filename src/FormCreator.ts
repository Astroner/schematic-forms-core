import { FormController } from "./FormController";
import { ControllerConfig } from "./types";

export class FormCreator<T extends ControllerConfig<any, any>>{
    constructor(private getConfig: () => T){
        
    }
    createForm(){
        return new FormController(this.getConfig());
    }
}