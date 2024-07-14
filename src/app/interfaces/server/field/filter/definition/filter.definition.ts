import { FilterAttributeDefinition } from "./filter.attribute.definition";

export interface FilterDefinition {
    query_type: string,
    query_example: string,
    attributes: FilterAttributeDefinition[]
}