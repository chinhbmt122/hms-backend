import { ApiProperty } from '@nestjs/swagger';
import { Gender } from './create-patient.dto';

export class PatientResponseDto {
  @ApiProperty({
    description: 'Unique patient identifier',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Account ID',
    example: 1,
  })
  account_id!: number;

  @ApiProperty({
    description: 'Full name of the patient',
    example: 'John Doe',
  })
  full_name!: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '1990-05-15',
    required: false,
  })
  date_of_birth?: Date;

  @ApiProperty({
    description: 'Gender',
    enum: Gender,
    example: Gender.MALE,
  })
  gender!: Gender;

  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890',
    required: false,
  })
  phone_number?: string;

  @ApiProperty({
    description: 'Residential address',
    example: '123 Main Street, City, State 12345',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'ID card number',
    example: '123456789',
    required: false,
  })
  id_card?: string;

  @ApiProperty({
    description: 'Health insurance number',
    example: 'INS123456',
    required: false,
  })
  health_insurance_number?: string;

  @ApiProperty({
    description: 'Full name of relative/emergency contact',
    example: 'Jane Doe',
    required: false,
  })
  relative_full_name?: string;

  @ApiProperty({
    description: 'Phone number of relative/emergency contact',
    example: '+0987654321',
    required: false,
  })
  relative_phone_number?: string;

  @ApiProperty({
    description: 'Record creation timestamp',
    example: '2024-10-23T10:30:00Z',
  })
  created_at!: Date;

  @ApiProperty({
    description: 'Record last update timestamp',
    example: '2024-10-23T15:45:00Z',
  })
  updated_at!: Date;
}

class PaginationMeta {
  @ApiProperty({
    description: 'Total number of records',
    example: 100,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages!: number;
}

export class PaginatedPatientResponseDto {
  @ApiProperty({
    description: 'Array of patient records',
    type: [PatientResponseDto],
  })
  data!: PatientResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMeta,
  })
  meta!: PaginationMeta;
}
