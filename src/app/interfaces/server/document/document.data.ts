import { DocumentKey } from "./document.key";

export interface DocumentData {
    data_base: string,
    collection: string,
    base_key: DocumentKey | undefined,
    keys: DocumentKey[],
    document: string
}