import { ApiProperty } from '@nestjs/swagger';

export interface Pagination {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
}

export class ApiResponse<T> {
    @ApiProperty()
    status: 'success' | 'error';

    @ApiProperty()
    message: string;
    @ApiProperty()
    data?: T | T[];

    @ApiProperty()
    pagination?: Pagination;

    @ApiProperty()
    error?: { code?: string; details?: string };
}
