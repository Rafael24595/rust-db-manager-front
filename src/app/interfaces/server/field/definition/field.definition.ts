import { FieldAttributeDefinition } from "./fiedl.attribute.definition";

export interface FieldDefinition {
    order: number;
    name: string;
    code: string;
    swsize: boolean;
    multiple: boolean;
    attributes: FieldAttributeDefinition[];
}