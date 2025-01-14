import { Dict } from "../../../types/dict";

export interface DocumentDataParser {
    data_base: string,
    collection: string,
    size: number,
    document: Dict<any>
}