import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ClientFactory } from '../Clients/ClientFactory';
import { ClientConstant, PatientMessages } from '@hms-backend/constants';
import {
  CreatePatientDto,
  UpdatePatientDto,
  PatientQueryDto,
} from '@hms-backend/dto';
import { firstValueFrom, timeout, catchError } from 'rxjs';

@Controller('patients')
export class PatientController {
  private patientClient: ClientProxy;

  constructor() {
    this.patientClient = ClientFactory.getInstance().getClient(
      ClientConstant.PATIENT_SERVICE
    );
  }

  // TODO: Add authentication guard when auth-service is ready
  // @UseGuards(AuthGuard)
  @Post()
  async createPatient(
    @Body(ValidationPipe) createPatientDto: CreatePatientDto
  ) {
    try {
      const result = await firstValueFrom(
        this.patientClient
          .send(PatientMessages.CREATE_PATIENT, createPatientDto)
          .pipe(
            timeout(5000),
            catchError((error) => {
              throw new HttpException(
                error.message || 'Patient service unavailable',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
              );
            })
          )
      );
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create patient',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // TODO: Add authentication guard when auth-service is ready
  // @UseGuards(AuthGuard)
  @Get()
  async getPatients(@Query(ValidationPipe) query: PatientQueryDto) {
    try {
      const result = await firstValueFrom(
        this.patientClient.send(PatientMessages.GET_PATIENTS, query).pipe(
          timeout(5000),
          catchError((error) => {
            throw new HttpException(
              error.message || 'Patient service unavailable',
              error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
          })
        )
      );
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve patients',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // TODO: Add authentication guard when auth-service is ready
  // @UseGuards(AuthGuard)
  @Get(':id')
  async getPatientById(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await firstValueFrom(
        this.patientClient.send(PatientMessages.GET_PATIENT_BY_ID, id).pipe(
          timeout(5000),
          catchError((error) => {
            throw new HttpException(
              error.message || 'Patient service unavailable',
              error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
          })
        )
      );
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve patient',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // TODO: Add authentication guard when auth-service is ready
  // @UseGuards(AuthGuard)
  @Patch(':id')
  async updatePatient(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePatientDto: UpdatePatientDto
  ) {
    try {
      const result = await firstValueFrom(
        this.patientClient
          .send(PatientMessages.UPDATE_PATIENT, { id, dto: updatePatientDto })
          .pipe(
            timeout(5000),
            catchError((error) => {
              throw new HttpException(
                error.message || 'Patient service unavailable',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
              );
            })
          )
      );
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update patient',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // TODO: Add authentication guard when auth-service is ready
  // @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePatient(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await firstValueFrom(
        this.patientClient.send(PatientMessages.DELETE_PATIENT, id).pipe(
          timeout(5000),
          catchError((error) => {
            throw new HttpException(
              error.message || 'Patient service unavailable',
              error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
          })
        )
      );
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete patient',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // TODO: Add authentication guard when auth-service is ready
  // @UseGuards(AuthGuard)
  @Post(':id/restore')
  async restorePatient(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await firstValueFrom(
        this.patientClient.send(PatientMessages.RESTORE_PATIENT, id).pipe(
          timeout(5000),
          catchError((error) => {
            throw new HttpException(
              error.message || 'Patient service unavailable',
              error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
          })
        )
      );
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to restore patient',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
