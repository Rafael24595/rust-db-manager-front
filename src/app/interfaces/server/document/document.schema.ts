import { FieldData } from "../field/generate/field.data";

export interface DocumentSchema {
    comments: string[],
    sw_strict: boolean,
    fields: FieldData[]
}