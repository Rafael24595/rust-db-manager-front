import { FieldAttribute } from "./fiedl.attribute";

export interface FieldData {
    order: number;
    code: string;
    value: string;
    swsize: boolean;
    size: number;
    attributes: FieldAttribute[];
}