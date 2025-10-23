import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PatientService } from './patient.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Patient } from '../entities/patient.entity';

describe('AppController', () => {
  let controller: AppController;
  let service: PatientService;

  const mockPatientService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: PatientService,
          useValue: mockPatientService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<PatientService>(PatientService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Patient CRUD operations', () => {
    it('should have createPatient method', () => {
      expect(controller.createPatient).toBeDefined();
    });

    it('should have getPatients method', () => {
      expect(controller.getPatients).toBeDefined();
    });

    it('should have getPatientById method', () => {
      expect(controller.getPatientById).toBeDefined();
    });

    it('should have updatePatient method', () => {
      expect(controller.updatePatient).toBeDefined();
    });

    it('should have deletePatient method', () => {
      expect(controller.deletePatient).toBeDefined();
    });

    it('should have restorePatient method', () => {
      expect(controller.restorePatient).toBeDefined();
    });
  });
});
