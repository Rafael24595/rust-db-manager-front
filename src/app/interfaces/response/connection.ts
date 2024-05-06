import { ServiceResources } from "./service.resources";

export interface Connection {
    category: string,
    connection: string,
    resources: ServiceResources
}