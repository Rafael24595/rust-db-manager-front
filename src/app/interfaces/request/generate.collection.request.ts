import { FieldData } from "../definition/field.data";

export interface GenerateCollectionRequest {
    data_base: string,
    collection: string,
    fields: FieldData[]
}