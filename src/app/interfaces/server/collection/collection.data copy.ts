import { Optional } from "../../../types/optional";
import { DocumentDataParser } from "../document/document.data.parsed";

export interface CollectionDataParsed {
    total: number,
    limit: Optional<number>,
    offset: Optional<number>,
    documents: DocumentDataParser[]
}