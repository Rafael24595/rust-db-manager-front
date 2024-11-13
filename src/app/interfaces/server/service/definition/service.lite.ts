import { ServiceCategoryLite } from "./service.category.lite";

export interface ServiceLite {
    name: string,
    protected: boolean,
    category: ServiceCategoryLite
}