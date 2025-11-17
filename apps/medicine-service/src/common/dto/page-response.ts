import { ApiProperty } from '@nestjs/swagger';
import type { Pagination } from './api-response';

export class PageResponse<T> {
    @ApiProperty()
    data: T[];

    @ApiProperty()
    pagination: Pagination;
}
