import { ServiceResources } from "./service.resources";

export interface ServiceCategory {
    category: string,
    connection: string,
    resources: ServiceResources
}