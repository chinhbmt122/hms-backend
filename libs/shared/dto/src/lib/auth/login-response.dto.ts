import { ApiProperty } from '@nestjs/swagger';
import { AccountResponseDto } from '../account/response/users-response.dto';

export class TokenPairDto {
  @ApiProperty({
    description: 'JWT access token (expires in 15 minutes)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token (expires in 7 days)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Account information',
    type: () => AccountResponseDto,
  })
  account: AccountResponseDto;

  @ApiProperty({
    description: 'Access and refresh tokens',
    type: () => TokenPairDto,
  })
  tokens: TokenPairDto;
}
