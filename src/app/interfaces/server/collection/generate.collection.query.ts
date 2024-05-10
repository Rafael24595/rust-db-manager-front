import { FieldData } from "../field/generate/field.data";

export interface GenerateCollectionQuery {
    data_base: string,
    collection: string,
    fields: FieldData[]
}