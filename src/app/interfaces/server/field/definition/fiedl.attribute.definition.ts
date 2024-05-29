import { FieldAttributeDefaultDefinition } from "./field.attribute.default.definition";

export interface FieldAttributeDefinition {
    name: string;
    code: string;
    values: FieldAttributeDefaultDefinition[];
}