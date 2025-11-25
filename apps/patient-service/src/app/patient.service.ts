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
    const { page = 1, limit = 10, search, gender, sortBy = 'created_at', sortOrder = 'DESC' } = query;

    const skip = (page - 1) * limit;

    const queryBuilder = this.patientRepository.createQueryBuilder('patient');

    // Apply search filter (partial match on full_name or phone_number)
    if (search) {
      queryBuilder.where(
        '(patient.full_name ILIKE :search OR patient.phone_number ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply gender filter
    if (gender) {
      if (search) {
        queryBuilder.andWhere('patient.gender = :gender', { gender });
      } else {
        queryBuilder.where('patient.gender = :gender', { gender });
      }
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

    Object.assign(patient, dto);
    const updatedPatient = await this.patientRepository.save(patient);

    return this.toResponseDto(updatedPatient);
  }

  /**
   * Delete a patient (hard delete)
   */
  async remove(id: number): Promise<void> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      throw new PatientNotFoundException(id);
    }

    await this.patientRepository.delete(id);
  }

  /**
   * Convert Patient entity to response DTO
   */
  private toResponseDto(patient: Patient): PatientResponseDto {
    return {
      id: patient.id,
      account_id: patient.account_id,
      full_name: patient.full_name,
      date_of_birth: patient.date_of_birth,
      gender: patient.gender,
      phone_number: patient.phone_number,
      address: patient.address,
      id_card: patient.id_card,
      health_insurance_number: patient.health_insurance_number,
      relative_full_name: patient.relative_full_name,
      relative_phone_number: patient.relative_phone_number,
      created_at: patient.created_at,
      updated_at: patient.updated_at,
    };
  }
}
