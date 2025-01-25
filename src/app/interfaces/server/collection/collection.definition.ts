import { FieldData } from "../field/generate/field.data";
import { FieldDefinition } from "../field/definition/field.definition";
import { FieldAttributeDefinition } from "../field/definition/fiedl.attribute.definition";
import { CollectionReferenceDefinition } from "./collection.reference.definition";

export interface CollectionDefinition {
    swrelational: boolean,
    definition: FieldDefinition[],
    defaults: FieldData[],
    global_attributes: FieldAttributeDefinition[],
    references: CollectionReferenceDefinition[]
}