import { FieldAttribute } from "./fiedl.attribute";
import { FieldReference } from "./field.reference";

export interface FieldData {
    order: number,
    code: string,
    value: string,
    swkey: boolean,
    swsize: boolean,
    size: number,
    mutable: boolean,
    json_type: string,
    attributes: FieldAttribute[],
    reference: FieldReference[]
}