import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class CreatePatientDto {
  @ApiProperty({
    description: 'Account ID of the patient',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  account_id!: number;

  @ApiProperty({
    description: 'Full name of the patient',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  full_name!: string;

  @ApiProperty({
    description: 'Date of birth in ISO 8601 format',
    example: '1990-05-15',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date_of_birth?: Date;

  @ApiProperty({
    description: 'Gender of the patient',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender!: Gender;

  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890',
    required: false,
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  phone_number?: string;

  @ApiProperty({
    description: 'Residential address',
    example: '123 Main Street, City, State 12345',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'ID card number',
    example: '123456789',
    required: false,
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  id_card?: string;

  @ApiProperty({
    description: 'Health insurance number',
    example: 'INS123456',
    required: false,
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  health_insurance_number?: string;

  @ApiProperty({
    description: 'Full name of relative/emergency contact',
    example: 'Jane Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  relative_full_name?: string;

  @ApiProperty({
    description: 'Phone number of relative/emergency contact',
    example: '+0987654321',
    required: false,
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  relative_phone_number?: string;
}
