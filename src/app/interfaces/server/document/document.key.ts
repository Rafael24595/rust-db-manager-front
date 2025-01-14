import { DocumentKeyAttribute } from "./document.key.attribute";

export interface DocumentKey {
    name: string,
    value: string,
    json_type: string,
    attributes: DocumentKeyAttribute[]
}