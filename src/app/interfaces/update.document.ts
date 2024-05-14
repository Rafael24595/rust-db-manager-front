import { DocumentKey } from "./server/document/document.key";

export interface UpdateDocument {
    document: String,
    keys: DocumentKey[],
}