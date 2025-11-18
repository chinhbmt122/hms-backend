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
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError } from 'rxjs';
import {
  CreatePatientDto,
  UpdatePatientDto,
  PatientQueryDto,
  PatientResponseDto,
  PaginatedPatientResponseDto,
} from '@hms-backend/dto';
import { PatientMessages } from '@hms-backend/constants';

@ApiTags('patients')
@Controller('patients')
export class PatientController {
  constructor(
    @Inject('PATIENT_SERVICE') private readonly patientClient: ClientProxy
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new patient',
    description: 'Creates a new patient record in the system',
  })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({
    status: 201,
    description: 'Patient created successfully',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async createPatient(
    @Body(ValidationPipe) createPatientDto: CreatePatientDto
  ): Promise<PatientResponseDto> {
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
  }

  @Get()
  @ApiOperation({
    summary: 'Get all patients',
    description:
      'Retrieve a paginated list of patients with optional search and filtering',
  })
  @ApiQuery({ type: PatientQueryDto })
  @ApiResponse({
    status: 200,
    description: 'List of patients retrieved successfully',
    type: PaginatedPatientResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async getPatients(
    @Query(ValidationPipe) query: PatientQueryDto
  ): Promise<PaginatedPatientResponseDto> {
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
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get patient by ID',
    description: 'Retrieve a single patient record by their ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Patient ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Patient retrieved successfully',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async getPatientById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<PatientResponseDto> {
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
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update patient',
    description: 'Update an existing patient record',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Patient ID',
    example: 1,
  })
  @ApiBody({ type: UpdatePatientDto })
  @ApiResponse({
    status: 200,
    description: 'Patient updated successfully',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async updatePatient(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePatientDto: UpdatePatientDto
  ): Promise<PatientResponseDto> {
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
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete patient',
    description: 'Delete a patient record permanently',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Patient ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Patient deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Patient deleted successfully' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async deletePatient(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ success: boolean; message: string }> {
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
  }
}
