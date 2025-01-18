import { DocumentKey } from "./document.key";

export interface DocumentData {
    format: string,
    data_base: string,
    collection: string,
    size: number,
    document: string
}