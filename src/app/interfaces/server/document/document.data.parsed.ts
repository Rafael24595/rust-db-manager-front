import { Dict } from "../../../types/dict";
import { Optional } from "../../../types/optional";
import { DocumentKey } from "./document.key";

export interface DocumentDataParser {
    data_base: string,
    collection: string,
    base_key: Optional<DocumentKey>,
    keys: DocumentKey[],
    document: Dict<any>
}