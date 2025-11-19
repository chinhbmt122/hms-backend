import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BasePagination } from 'libs/shared/dto/src/index';
import { AccountStatus } from '@hms-backend/constants';

export class QueryAccountDto extends BasePagination {
  @IsOptional()
  id?: number;

  @IsOptional()
  fullName?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  roleId?: number;

  @IsOptional()
  isVerifiedEmail?: boolean;

  @IsOptional()
  createdAt?: Date;

  @ApiProperty({
    description: 'Status account',
  })
  @IsOptional()
  status: AccountStatus | null;
}
