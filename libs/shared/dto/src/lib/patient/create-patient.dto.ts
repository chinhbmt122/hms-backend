import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
  MaxLength,
  IsObject,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export class EmergencyContactDto {
  @ApiProperty({
    description: 'Full name of emergency contact person',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'Phone number of emergency contact',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    description: 'Relationship to the patient',
    example: 'Spouse',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  relationship!: string;
}

export class CreatePatientDto {
  @ApiProperty({
    description: 'First name of the patient',
    example: 'Jane',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName!: string;

  @ApiProperty({
    description: 'Last name of the patient',
    example: 'Smith',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName!: string;

  @ApiProperty({
    description: 'Date of birth in ISO 8601 format',
    example: '1990-05-15',
    type: String,
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth!: Date;

  @ApiProperty({
    description: 'Gender of the patient',
    enum: Gender,
    example: Gender.FEMALE,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender!: Gender;

  @ApiProperty({
    description: 'Email address of the patient',
    example: 'jane.smith@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Primary phone number',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    description: 'Full residential address',
    example: '123 Main Street, City, State 12345',
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({
    description: 'Blood group of the patient',
    enum: BloodGroup,
    example: BloodGroup.O_POSITIVE,
    required: false,
  })
  @IsEnum(BloodGroup)
  @IsOptional()
  bloodGroup?: BloodGroup;

  @ApiProperty({
    description: 'Emergency contact information',
    type: EmergencyContactDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  @IsNotEmpty()
  emergencyContact!: EmergencyContactDto;

  @ApiProperty({
    description: 'Medical history notes',
    example: 'Diabetes Type 2, Hypertension',
    required: false,
  })
  @IsString()
  @IsOptional()
  medicalHistory?: string;

  @ApiProperty({
    description: 'List of known allergies',
    example: ['Penicillin', 'Peanuts'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergies?: string[];
}
