import { TableDefinition } from "../../table/definition/table.definition";
import { ActionFormCollection } from "./action.form.collection";

export interface ActionDefinition {
    action: string,
    title: string,
    data: TableDefinition[],
    form: ActionFormCollection
}