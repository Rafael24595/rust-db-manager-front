import { FilterAttributeDefinition } from "./filter.attribute.definition";
import { FilterDefinitionQuery } from "./filter.definition.query";
import { FilterFieldsDefinition } from "./filter.fields.definition";

export interface FilterDefinition {
    category_root: string,
    category_query: FilterDefinitionQuery,
    categories: string[],
    fields: FilterFieldsDefinition[],
    attributes: FilterAttributeDefinition[]
}