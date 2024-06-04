import { FilterValueAttribute } from "./filter.value.attribute";
import { FilterElement } from "./filter.element";

export interface FilterValue {
    category: string,
    value: string,
    attributes: FilterValueAttribute[],
    children: FilterElement[]
}