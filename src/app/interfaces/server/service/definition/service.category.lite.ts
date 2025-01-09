import { ServiceResources } from "./service.resources";

export interface ServiceCategoryLite {
    category: String,
    default: boolean,
    resources: ServiceResources
}