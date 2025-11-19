import { ApiProperty } from '@nestjs/swagger';

export class PaginatedMeta {
  @ApiProperty({ example: 1, description: 'Current page number' })
  page?: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  limit?: number;

  @ApiProperty({
    example: 50,
    description: 'Total number of elements in the collection',
  })
  totalElements?: number;
}

export class PaginatedResult<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty({ type: PaginatedMeta })
  meta?: PaginatedMeta;
}
