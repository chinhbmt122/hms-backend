import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientService } from './patient.service';
import { Patient } from '../entities/patient.entity';
import {
  CreatePatientDto,
  UpdatePatientDto,
  Gender,
  BloodGroup,
  PatientQueryDto,
  SortOrder,
} from '@hms-backend/dto';
import {
  PatientNotFoundException,
  DuplicatePatientException,
} from '../exceptions';

describe('PatientService', () => {
  let service: PatientService;
  let repository: Repository<Patient>;

  const mockPatient: Patient = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1990-01-01'),
    gender: Gender.MALE,
    email: 'john.doe@example.com',
    phone: '1234567890',
    address: '123 Main St',
    bloodGroup: BloodGroup.O_POSITIVE,
    emergencyContact: {
      name: 'Jane Doe',
      phone: '0987654321',
      relationship: 'Spouse',
    },
    medicalHistory: 'No known conditions',
    allergies: ['Peanuts'],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: getRepositoryToken(Patient),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
    repository = module.get<Repository<Patient>>(getRepositoryToken(Patient));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new patient successfully', async () => {
      const createDto: CreatePatientDto = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        gender: Gender.MALE,
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main St',
        bloodGroup: BloodGroup.O_POSITIVE,
        emergencyContact: {
          name: 'Jane Doe',
          phone: '0987654321',
          relationship: 'Spouse',
        },
        allergies: ['Peanuts'],
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockPatient);
      mockRepository.save.mockResolvedValue(mockPatient);

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createDto.email },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw DuplicatePatientException if email already exists', async () => {
      const createDto: CreatePatientDto = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        gender: Gender.MALE,
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main St',
        emergencyContact: {
          name: 'Jane Doe',
          phone: '0987654321',
          relationship: 'Spouse',
        },
      };

      mockRepository.findOne.mockResolvedValue(mockPatient);

      await expect(service.create(createDto)).rejects.toThrow(
        DuplicatePatientException
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated patients', async () => {
      const query: PatientQueryDto = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: SortOrder.DESC,
      };

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockPatient], 1]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(query);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a patient by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockPatient);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw PatientNotFoundException if patient not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        PatientNotFoundException
      );
    });
  });

  describe('update', () => {
    it('should update a patient successfully', async () => {
      const updateDto: UpdatePatientDto = {
        firstName: 'Jane',
      };

      const updatedPatient = { ...mockPatient, firstName: 'Jane' };

      mockRepository.findOne.mockResolvedValue(mockPatient);
      mockRepository.save.mockResolvedValue(updatedPatient);

      const result = await service.update(1, updateDto);

      expect(result.firstName).toBe('Jane');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw PatientNotFoundException if patient not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(
        PatientNotFoundException
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a patient', async () => {
      mockRepository.findOne.mockResolvedValue(mockPatient);
      mockRepository.softDelete.mockResolvedValue({ affected: 1, raw: {} });

      await service.remove(1);

      expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw PatientNotFoundException if patient not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        PatientNotFoundException
      );
    });
  });

  describe('restore', () => {
    it('should restore a soft-deleted patient', async () => {
      const deletedPatient = { ...mockPatient, deletedAt: new Date() };

      mockRepository.findOne
        .mockResolvedValueOnce(deletedPatient)
        .mockResolvedValueOnce(mockPatient);
      mockRepository.restore.mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.restore(1);

      expect(result).toBeDefined();
      expect(mockRepository.restore).toHaveBeenCalledWith(1);
    });

    it('should throw PatientNotFoundException if patient not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.restore(999)).rejects.toThrow(
        PatientNotFoundException
      );
    });
  });
});
