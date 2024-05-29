export interface PaginatedCollection<T> {
    total: number,
    previous: number,
    next: number,
    services: T[],
}