import { FieldAttributeDefinition } from "./fiedl.attribute.definition";

export interface FieldDefinition {
    order: number;
    name: string;
    code: string;
    swkey: boolean;
    swsize: boolean;
    multiple: boolean;
    attributes: FieldAttributeDefinition[];
}