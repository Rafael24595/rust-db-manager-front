import { FieldAttributeDefinition } from "./fiedl.attribute.definition";

export interface FieldDefinition {
    order: number;
    name: string;
    code: string;
    category: string;
    size: boolean;
    multiple: boolean;
    attributes: FieldAttributeDefinition[];
}