import { FieldData } from "./field.data";
import { FieldDefinition } from "./field.definition";

export interface CollectionDefinition {
    swrelational: boolean,
    definition: FieldDefinition[],
    defaults: FieldData[]
}