export interface Pagination {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
}

export class ApiResponse<T> {
    status: 'success' | 'error';
    message: string;
    data?: T | T[];
    pagination?: Pagination;
    error?: { code?: string; details?: string };
}
