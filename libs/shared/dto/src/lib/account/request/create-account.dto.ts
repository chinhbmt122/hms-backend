import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({ example: 'account@example.com' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  // @ApiProperty({ example: 'Nguyễn Văn A', minLength: 3, maxLength: 50 })
  // @IsString({ message: 'Full name must be a string' })
  // @Length(3, 50, { message: 'Full name must be between 3 and 50 characters' })
  // fullName: string;

  @ApiProperty({
    example: 'Abcdefg1',
    description: 'Password must at least 8 chars',
    minLength: 8,
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      minUppercase: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number',
    }
  )
  password: string;
}
