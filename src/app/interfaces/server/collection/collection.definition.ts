import { FieldData } from "../field/generate/field.data";
import { FieldDefinition } from "../field/definition/field.definition";

export interface CollectionDefinition {
    swrelational: boolean,
    definition: FieldDefinition[],
    defaults: FieldData[]
}