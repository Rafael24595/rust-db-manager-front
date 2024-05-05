import { DataBaseField } from "./data.base.field";

export interface DataBaseGroup { 
    order: number,
    name: string,
    fields: DataBaseField[]
}