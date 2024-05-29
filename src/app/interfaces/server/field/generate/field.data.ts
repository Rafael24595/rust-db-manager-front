import { FieldAttribute } from "./fiedl.attribute";
import { FieldReference } from "./field.reference";

export interface FieldData {
    order: number,
    code: string,
    value: string,
    swsize: boolean,
    size: number,
    mutable: boolean,
    attributes: FieldAttribute[],
    reference: FieldReference[]
}