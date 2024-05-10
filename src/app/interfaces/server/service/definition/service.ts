import { ServiceCategory } from "./service.category";

export interface Service {
    name: string,
    owner: string,
    protected: boolean,
    timestamp: number,
    connection_data: ServiceCategory,
}