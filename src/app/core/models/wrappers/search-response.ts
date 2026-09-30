export class SearchResponse<T> {
    items: T[]
    totalItem: number
    currentPage: number
    pageSize: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
}