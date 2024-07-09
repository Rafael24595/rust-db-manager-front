import { FormFieldDefinition } from "./form.field.definition";

export interface ActionForm {
    code: string,
    title: string,
    sw_vector: boolean,
    fields: FormFieldDefinition[]
}