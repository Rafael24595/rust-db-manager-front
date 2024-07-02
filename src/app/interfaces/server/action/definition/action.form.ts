import { FormFieldDefinition } from "./form.field.definition";

export interface ActionForm {
    title: string,
    sw_vector: boolean,
    fields: FormFieldDefinition[]
}