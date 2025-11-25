import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientService } from './patient.service';
import { Patient } from '../entities/patient.entity';
import {
  CreatePatientDto,
  UpdatePatientDto,
  Gender,
  PatientQueryDto,
  SortOrder,
} from '@hms-backend/dto';
import { PatientNotFoundException } from '../exceptions';

describe('PatientService', () => {
  let service: PatientService;
  let repository: Repository<Patient>;

  const mockPatient: Patient = {
    id: 1,
    account_id: 1,
    full_name: 'John Doe',
    date_of_birth: new Date('1990-01-01'),
    gender: Gender.MALE,
    phone_number: '+1234567890',
    address: '123 Main St',
    id_card: '123456789',
    health_insurance_number: 'INS123456',
    relative_full_name: 'Jane Doe',
    relative_phone_number: '+0987654321',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
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
        account_id: 1,
        full_name: 'John Doe',
        date_of_birth: new Date('1990-01-01'),
        gender: Gender.MALE,
        phone_number: '+1234567890',
        address: '123 Main St',
        id_card: '123456789',
        health_insurance_number: 'INS123456',
        relative_full_name: 'Jane Doe',
        relative_phone_number: '+0987654321',
      };

      mockRepository.create.mockReturnValue(mockPatient);
      mockRepository.save.mockResolvedValue(mockPatient);

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(result.full_name).toBe('John Doe');
      expect(result.account_id).toBe(1);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should create a patient with minimal required fields', async () => {
      const createDto: CreatePatientDto = {
        account_id: 2,
        full_name: 'Jane Smith',
        gender: Gender.FEMALE,
      };

      const minimalPatient = {
        ...mockPatient,
        id: 2,
        account_id: 2,
        full_name: 'Jane Smith',
        gender: Gender.FEMALE,
        phone_number: undefined,
        address: undefined,
        id_card: undefined,
        health_insurance_number: undefined,
        relative_full_name: undefined,
        relative_phone_number: undefined,
      };

      mockRepository.create.mockReturnValue(minimalPatient);
      mockRepository.save.mockResolvedValue(minimalPatient);

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(result.full_name).toBe('Jane Smith');
      expect(result.account_id).toBe(2);
    });
  });

  describe('findAll', () => {
    it('should return paginated patients with default sorting', async () => {
      const query: PatientQueryDto = {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
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
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'patient.created_at',
        'DESC'
      );
    });

    it('should filter patients by search term', async () => {
      const query: PatientQueryDto = {
        page: 1,
        limit: 10,
        search: 'John',
        sortBy: 'created_at',
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
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        '(patient.full_name ILIKE :search OR patient.phone_number ILIKE :search)',
        { search: '%John%' }
      );
    });

    it('should filter patients by gender', async () => {
      const query: PatientQueryDto = {
        page: 1,
        limit: 10,
        gender: Gender.MALE,
        sortBy: 'created_at',
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
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'patient.gender = :gender',
        { gender: Gender.MALE }
      );
    });

    it('should filter by both search and gender', async () => {
      const query: PatientQueryDto = {
        page: 1,
        limit: 10,
        search: 'John',
        gender: Gender.MALE,
        sortBy: 'created_at',
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
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'patient.gender = :gender',
        { gender: Gender.MALE }
      );
    });
  });

  describe('findOne', () => {
    it('should return a patient by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockPatient);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.full_name).toBe('John Doe');
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
        full_name: 'Jane Doe',
        phone_number: '+1999999999',
      };

      const updatedPatient = {
        ...mockPatient,
        full_name: 'Jane Doe',
        phone_number: '+1999999999',
        updated_at: new Date(),
      };

      mockRepository.findOne.mockResolvedValue({ ...mockPatient });
      mockRepository.save.mockResolvedValue(updatedPatient);

      const result = await service.update(1, updateDto);

      expect(result.full_name).toBe('Jane Doe');
      expect(result.phone_number).toBe('+1999999999');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update only specified fields', async () => {
      const updateDto: UpdatePatientDto = {
        address: 'New Address',
      };

      const updatedPatient = {
        ...mockPatient,
        address: 'New Address',
      };

      mockRepository.findOne.mockResolvedValue({ ...mockPatient });
      mockRepository.save.mockImplementation((patient) => Promise.resolve(patient));

      const result = await service.update(1, updateDto);

      expect(result.address).toBe('New Address');
      expect(result.full_name).toBe('John Doe'); // Unchanged
    });

    it('should throw PatientNotFoundException if patient not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(
        PatientNotFoundException
      );
    });
  });

  describe('remove', () => {
    it('should hard delete a patient', async () => {
      mockRepository.findOne.mockResolvedValue(mockPatient);
      mockRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw PatientNotFoundException if patient not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        PatientNotFoundException
      );
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
});
