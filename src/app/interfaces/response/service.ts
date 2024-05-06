import { Connection } from "./connection";

export interface Service {
    name: string,
    owner: string,
    protected: boolean,
    timestamp: number,
    connection_data: Connection,
}