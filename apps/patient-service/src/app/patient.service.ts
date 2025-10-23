import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import {
  CreatePatientDto,
  UpdatePatientDto,
  PatientQueryDto,
  PatientResponseDto,
  PaginatedPatientResponseDto,
} from '@hms-backend/dto';
import { Patient } from '../entities/patient.entity';
import {
  PatientNotFoundException,
  DuplicatePatientException,
} from '../exceptions';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>
  ) {}

  /**
   * Create a new patient
   */
  async create(dto: CreatePatientDto): Promise<PatientResponseDto> {
    // Check for duplicate email if provided
    if (dto.email) {
      const existingPatient = await this.patientRepository.findOne({
        where: { email: dto.email },
      });
      if (existingPatient) {
        throw new DuplicatePatientException('email', dto.email);
      }
    }

    const patient = this.patientRepository.create(dto);
    const savedPatient = await this.patientRepository.save(patient);
    return this.toResponseDto(savedPatient);
  }

  /**
   * Get all patients with pagination and search
   */
  async findAll(
    query: PatientQueryDto
  ): Promise<PaginatedPatientResponseDto> {
    const { page = 1, limit = 10, search, gender, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

    const skip = (page - 1) * limit;

    const queryBuilder = this.patientRepository
      .createQueryBuilder('patient')
      .where('patient.deletedAt IS NULL'); // Exclude soft-deleted records

    // Apply search filter (partial match on firstName, lastName, email, phone)
    if (search) {
      queryBuilder.andWhere(
        '(patient.firstName ILIKE :search OR patient.lastName ILIKE :search OR patient.email ILIKE :search OR patient.phone ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply gender filter
    if (gender) {
      queryBuilder.andWhere('patient.gender = :gender', { gender });
    }

    // Apply sorting
    queryBuilder.orderBy(`patient.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    // Apply pagination
    queryBuilder.skip(skip).take(limit);

    const [patients, total] = await queryBuilder.getManyAndCount();

    return {
      data: patients.map((patient) => this.toResponseDto(patient)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single patient by ID
   */
  async findOne(id: number): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      throw new PatientNotFoundException(id);
    }

    return this.toResponseDto(patient);
  }

  /**
   * Update a patient
   */
  async update(
    id: number,
    dto: UpdatePatientDto
  ): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      throw new PatientNotFoundException(id);
    }

    // Check for duplicate email if being updated
    if (dto.email && dto.email !== patient.email) {
      const existingPatient = await this.patientRepository.findOne({
        where: { email: dto.email },
      });
      if (existingPatient) {
        throw new DuplicatePatientException('email', dto.email);
      }
    }

    Object.assign(patient, dto);
    const updatedPatient = await this.patientRepository.save(patient);

    return this.toResponseDto(updatedPatient);
  }

  /**
   * Soft delete a patient
   */
  async remove(id: number): Promise<void> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      throw new PatientNotFoundException(id);
    }

    await this.patientRepository.softDelete(id);
  }

  /**
   * Restore a soft-deleted patient
   */
  async restore(id: number): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      withDeleted: true, // Include soft-deleted records
    });

    if (!patient) {
      throw new PatientNotFoundException(id);
    }

    if (!patient.deletedAt) {
      // Patient is not deleted, return as is
      return this.toResponseDto(patient);
    }

    await this.patientRepository.restore(id);

    const restoredPatient = await this.patientRepository.findOne({
      where: { id },
    });

    return this.toResponseDto(restoredPatient!);
  }

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  /**
   * Convert Patient entity to response DTO
   */
  private toResponseDto(patient: Patient): PatientResponseDto {
    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      age: this.calculateAge(patient.dateOfBirth),
      gender: patient.gender,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      bloodGroup: patient.bloodGroup,
      emergencyContact: patient.emergencyContact,
      medicalHistory: patient.medicalHistory,
      allergies: patient.allergies,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };
  }
}
