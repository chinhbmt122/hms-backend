import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus, Role } from 'libs/shared/constants/src/index';

export class AccountResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'account@example.com' })
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ enum: AccountStatus })
  status: AccountStatus;

  @ApiProperty()
  isVerifiedEmail: boolean;

  @ApiProperty()
  createdAt?: Date | null;

  @ApiProperty()
  updatedAt?: Date | null;

  @ApiProperty()
  deletedAt?: Date | null;
}
