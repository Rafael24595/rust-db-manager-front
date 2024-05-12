import { DocumentKeyAttribute } from "./document.key.attribute";

export interface DocumentKey {
    name: string,
    value: string,
    jtype: string,
    attributes: DocumentKeyAttribute[]
}