import { TableDataField } from "./data.base.field";

export interface TableDataGroup { 
    order: number,
    name: string,
    fields: TableDataField[]
}