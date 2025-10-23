import { Gender, BloodGroup, EmergencyContactDto } from './create-patient.dto';

export class PatientResponseDto {
  id!: number;
  firstName!: string;
  lastName!: string;
  dateOfBirth!: Date;
  age!: number; // Computed field
  gender!: Gender;
  email?: string;
  phone!: string;
  address!: string;
  bloodGroup?: BloodGroup;
  emergencyContact!: EmergencyContactDto;
  medicalHistory?: string;
  allergies?: string[];
  createdAt!: Date;
  updatedAt!: Date;
}

export class PaginatedPatientResponseDto {
  data!: PatientResponseDto[];
  meta!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
