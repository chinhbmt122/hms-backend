import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max } from 'class-validator';
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from './constants/pagination';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BasePagination {
  @ApiPropertyOptional({
    description: 'Current page number',
    default: DEFAULT_PAGE,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsOptional()
  page: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: DEFAULT_LIMIT,
    example: 10,
  })
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsOptional()
  @Max(MAX_LIMIT)
  limit: number = DEFAULT_LIMIT;

  @ApiPropertyOptional({
    description: 'Global search query applied to searchable fields',
    example: '',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort by field(s). Use "+" for ASC, "-" for DESC',
    example: '-id,+name',
  })
  @IsOptional()
  @IsString()
  sort?: string; // e.g., "-id,+name"
}

export class SortFieldOptions {
  sort?: string; // e.g., "-name,+id"
  sortAbleFields?: string[];
}
