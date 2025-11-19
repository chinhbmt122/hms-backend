import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus, Role } from 'libs/shared/constants/src/index';

export class AccountResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'account@example.com' })
  email: string;

  @ApiProperty({ type: () => Role })
  role: Role;

  @ApiProperty()
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
