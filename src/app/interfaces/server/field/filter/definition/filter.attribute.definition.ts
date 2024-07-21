import { FilterAttributeDefaultDefinition } from "./filter.attribute.default.definition"

export interface FilterAttributeDefinition {
    code: string,
    name: string,
    description: string,
    values: FilterAttributeDefaultDefinition[],
    applies: string[],
}