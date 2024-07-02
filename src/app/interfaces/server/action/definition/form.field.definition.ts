import { FormDefault } from "./form.default";

export interface FormFieldDefinition {
    order: number,
    code: string,
    name: string,
    sw_vector: boolean,
    values: FormDefault[],
}