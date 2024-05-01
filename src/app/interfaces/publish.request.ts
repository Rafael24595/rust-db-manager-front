import { ConnectionData } from "./connection.data";

export interface PublishRequest {
    name: string,
    owner: string,
    protected: boolean,
    password: string,
    connection_data: ConnectionData
}