import { ApiProperty } from '@nestjs/swagger';
import { Gender, BloodGroup, EmergencyContactDto } from './create-patient.dto';

export class PatientResponseDto {
  @ApiProperty({
    description: 'Unique patient identifier',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'First name of the patient',
    example: 'Jane',
  })
  firstName!: string;

  @ApiProperty({
    description: 'Last name of the patient',
    example: 'Smith',
  })
  lastName!: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '1990-05-15',
  })
  dateOfBirth!: Date;

  @ApiProperty({
    description: 'Calculated age based on date of birth',
    example: 33,
  })
  age!: number;

  @ApiProperty({
    description: 'Gender',
    enum: Gender,
    example: Gender.FEMALE,
  })
  gender!: Gender;

  @ApiProperty({
    description: 'Email address',
    example: 'jane.smith@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Primary phone number',
    example: '+1234567890',
  })
  phone!: string;

  @ApiProperty({
    description: 'Residential address',
    example: '123 Main Street, City, State 12345',
  })
  address!: string;

  @ApiProperty({
    description: 'Blood group',
    enum: BloodGroup,
    example: BloodGroup.O_POSITIVE,
    required: false,
  })
  bloodGroup?: BloodGroup;

  @ApiProperty({
    description: 'Emergency contact information',
    type: EmergencyContactDto,
  })
  emergencyContact!: EmergencyContactDto;

  @ApiProperty({
    description: 'Medical history notes',
    example: 'Diabetes Type 2, Hypertension',
    required: false,
  })
  medicalHistory?: string;

  @ApiProperty({
    description: 'List of known allergies',
    example: ['Penicillin', 'Peanuts'],
    type: [String],
    required: false,
  })
  allergies?: string[];

  @ApiProperty({
    description: 'Record creation timestamp',
    example: '2024-10-23T10:30:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Record last update timestamp',
    example: '2024-10-23T15:45:00Z',
  })
  updatedAt!: Date;
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
