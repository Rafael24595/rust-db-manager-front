import { Optional } from "../types/optional";
import { DocumentKey } from "./server/document/document.key";

export interface WorkshopFormRequest {
    base_key: Optional<DocumentKey>,
    keys: DocumentKey[],
}