import { DocumentKey } from "./server/document/document.key";

export interface WorkshopFormRequest {
    keys: DocumentKey[],
}