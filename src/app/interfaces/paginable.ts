export interface Paginable<T> {
    total: number,
    previous: number,
    next: number,
    services: T[],
}