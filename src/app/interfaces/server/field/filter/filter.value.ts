import { FilterValueAttribute } from "./filter.value.attribute";
import { FilterElement } from "./filter.element";

export interface FilterValue {
    category: string,
    json_type: string,
    value: string,
    attributes: FilterValueAttribute[],
    children: FilterElement[]
}