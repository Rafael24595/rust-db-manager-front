import { Optional } from "../../../types/optional";
import { DocumentData } from "../document/document.data";

export interface CollectionData {
    total: number,
    limit: Optional<number>,
    offset: Optional<number>,
    documents: DocumentData[]
}