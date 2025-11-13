import { Pagination } from './api-response';

export class PageResponse<T> {
    data: T[];
    pagination: Pagination;
}
