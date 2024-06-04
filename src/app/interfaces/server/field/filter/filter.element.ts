import { FilterValue } from "./filter.value";

export interface FilterElement {
    key: string,
    value: FilterValue,
    direction: boolean,
    negation: boolean,
}