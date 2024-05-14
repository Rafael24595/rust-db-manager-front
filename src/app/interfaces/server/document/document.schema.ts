import { FieldData } from "../field/generate/field.data";

export interface DocumentSchema {
    comments: string[],
    fields: FieldData[]
}