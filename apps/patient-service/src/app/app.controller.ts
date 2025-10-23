import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PatientMessages } from '@hms-backend/constants';
import {
  CreatePatientDto,
  UpdatePatientDto,
  PatientQueryDto,
} from '@hms-backend/dto';
import { PatientService } from './patient.service';

@Controller()
export class AppController {
  constructor(private readonly patientService: PatientService) {}

  @MessagePattern(PatientMessages.CREATE_PATIENT)
  async createPatient(@Payload() dto: CreatePatientDto) {
    return await this.patientService.create(dto);
  }

  @MessagePattern(PatientMessages.GET_PATIENTS)
  async getPatients(@Payload() query: PatientQueryDto) {
    return await this.patientService.findAll(query);
  }

  @MessagePattern(PatientMessages.GET_PATIENT_BY_ID)
  async getPatientById(@Payload() id: number) {
    return await this.patientService.findOne(id);
  }

  @MessagePattern(PatientMessages.UPDATE_PATIENT)
  async updatePatient(
    @Payload() payload: { id: number; dto: UpdatePatientDto }
  ) {
    return await this.patientService.update(payload.id, payload.dto);
  }

  @MessagePattern(PatientMessages.DELETE_PATIENT)
  async deletePatient(@Payload() id: number) {
    await this.patientService.remove(id);
    return { success: true, message: 'Patient deleted successfully' };
  }

  @MessagePattern(PatientMessages.RESTORE_PATIENT)
  async restorePatient(@Payload() id: number) {
    return await this.patientService.restore(id);
  }
}
