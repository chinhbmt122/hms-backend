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
  RegisterPatientDto,
  AccountResponseDto,
} from '@hms-backend/dto';
import { PatientMessages, AccountMessages } from '@hms-backend/constants';

@ApiTags('patients')
@Controller('patients')
export class PatientController {
  constructor(
    @Inject('PATIENT_SERVICE') private readonly patientClient: ClientProxy,
    @Inject('ACCOUNT_SERVICE') private readonly accountClient: ClientProxy
  ) {}

  /**
   * Helper method: Delete account with retry logic
   */
  private async deleteAccountWithRetry(
    accountId: number,
    maxRetries: number = 2
  ): Promise<void> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await firstValueFrom(
          this.accountClient
            .send(AccountMessages.REMOVE_ACCOUNT, accountId)
            .pipe(timeout(3000))
        );
        return; // Success
      } catch (error) {
        if (attempt === maxRetries) {
          throw error; // Final failure
        }
        // Exponential backoff: wait 1s, 2s, 4s...
        await this.sleep(1000 * Math.pow(2, attempt));
      }
    }
  }

  /**
   * Helper method: Check if account is already linked to another patient
   */
  private async checkAccountNotLinked(accountId: number): Promise<void> {
    try {
      const patients = await firstValueFrom(
        this.patientClient
          .send(PatientMessages.GET_PATIENTS, {
            page: 1,
            limit: 1,
            // Note: This assumes patient service supports filtering by account_id
            // If not, you may need to add this filter capability
          })
          .pipe(timeout(3000))
      );

      // For now, we'll skip this check since we don't have account_id filter
      // TODO: Add account_id filter to patient service
    } catch (error) {
      console.error('Failed to check account linkage:', error);
      // Don't block the operation if check fails
    }
  }

  /**
   * Helper method: Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  @Post('register')
  @ApiOperation({
    summary: 'Patient self-registration with account',
    description:
      'Creates both an account and patient profile in a single operation. ' +
      'If patient creation fails, the account will be automatically deleted (compensating transaction). ' +
      'Use this endpoint for online self-registration where patients need login credentials.',
  })
  @ApiBody({ type: RegisterPatientDto })
  @ApiResponse({
    status: 201,
    description: 'Patient and account registered successfully',
    schema: {
      type: 'object',
      properties: {
        account: {
          type: 'object',
          description: 'Created account details',
        },
        patient: {
          type: 'object',
          description: 'Created patient details',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data or email already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async registerPatient(
    @Body(ValidationPipe) registerDto: RegisterPatientDto
  ): Promise<{
    account: AccountResponseDto;
    patient: PatientResponseDto;
  }> {
    let createdAccount: AccountResponseDto | null = null;

    try {
      // Step 1: Create account via auth service
      createdAccount = await firstValueFrom(
        this.accountClient
          .send(AccountMessages.CREATE_ACCOUNT, {
            email: registerDto.email,
            password: registerDto.password,
          })
          .pipe(
            timeout(5000),
            catchError((error) => {
              throw new HttpException(
                error.message || 'Account service unavailable',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
              );
            })
          )
      );

      // Step 2: Create patient with the account_id
      const createdPatient = await firstValueFrom(
        this.patientClient
          .send(PatientMessages.CREATE_PATIENT, {
            account_id: createdAccount.id,
            full_name: registerDto.full_name,
            date_of_birth: registerDto.date_of_birth,
            gender: registerDto.gender,
            phone_number: registerDto.phone_number,
            address: registerDto.address,
            id_card: registerDto.id_card,
            health_insurance_number: registerDto.health_insurance_number,
            relative_full_name: registerDto.relative_full_name,
            relative_phone_number: registerDto.relative_phone_number,
          })
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

      // Step 3: Return both account and patient
      return {
        account: createdAccount,
        patient: createdPatient,
      };
    } catch (error) {
      // Compensating transaction: If patient creation failed but account was created,
      // delete the account to maintain data consistency
      if (createdAccount) {
        try {
          // Retry deletion up to 2 times with exponential backoff
          await this.deleteAccountWithRetry(createdAccount.id, 2);

          console.log(
            `✅ Compensating transaction successful: Deleted account ${createdAccount.id} after patient creation failure`
          );
        } catch (deleteError) {
          // Critical: Account orphaned - log for manual cleanup
          console.error(
            `❌ CRITICAL ORPHANED ACCOUNT: Failed to delete account ${createdAccount.id} ` +
            `with email ${createdAccount.email} during compensating transaction. ` +
            `Manual cleanup required. Original error: ${error.message}`,
            {
              accountId: createdAccount.id,
              email: createdAccount.email,
              timestamp: new Date().toISOString(),
              originalError: error.message,
              deleteError: deleteError.message,
            }
          );

          // TODO: Add to cleanup queue, send alert to monitoring system
        }
      }

      // Provide user-friendly error message
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Registration failed. Please try again. If the problem persists, contact support.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new patient (with or without account)',
    description:
      'Creates a new patient record. Can optionally link to an existing account by providing account_id, ' +
      'or create a standalone patient record (for walk-in/elder patients who do not need online access).',
  })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({
    status: 201,
    description: 'Patient created successfully',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data or account_id not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async createPatient(
    @Body(ValidationPipe) createPatientDto: CreatePatientDto
  ): Promise<PatientResponseDto> {
    // If account_id is provided, verify it exists and is not already linked
    if (createPatientDto.account_id) {
      try {
        // Verify account exists
        await firstValueFrom(
          this.accountClient
            .send(
              AccountMessages.FIND_ONE_ACCOUNT,
              createPatientDto.account_id
            )
            .pipe(
              timeout(3000),
              catchError((error) => {
                throw new HttpException(
                  `Account with ID ${createPatientDto.account_id} does not exist. ` +
                  `Please create the account first or omit account_id to create a patient without an account.`,
                  HttpStatus.BAD_REQUEST
                );
              })
            )
        );

        // Note: We should also check if this account is already linked to another patient
        // This requires adding a "findByAccountId" method to patient service
        // TODO: Add validation to prevent one account being linked to multiple patients

      } catch (error) {
        throw error;
      }
    } else {
      console.log(
        `Creating patient without account (walk-in/elder patient): ${createPatientDto.full_name}`
      );
    }

    // Create patient (account_id can be null or a valid account ID)
    try {
      const result = await firstValueFrom(
        this.patientClient
          .send(PatientMessages.CREATE_PATIENT, createPatientDto)
          .pipe(
            timeout(5000),
            catchError((error) => {
              throw new HttpException(
                error.message || 'Failed to create patient',
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
              );
            })
          )
      );

      console.log(
        `✅ Successfully created patient ${result.id} ` +
        `${createPatientDto.account_id ? `linked to account ${createPatientDto.account_id}` : 'without account'}`
      );

      return result;
    } catch (error) {
      throw error;
    }
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

  @Patch(':id/link-account')
  @ApiOperation({
    summary: 'Link patient to an account',
    description:
      'Links an existing patient (e.g., elder patient created by staff) to an account for online access. ' +
      'Useful when a patient initially had no account but later needs online login credentials.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Patient ID',
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'number',
          example: 1,
          description: 'Account ID to link to this patient',
        },
      },
      required: ['account_id'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Patient linked to account successfully',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Account not found or already linked to another patient',
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async linkAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { account_id: number }
  ): Promise<PatientResponseDto> {
    // Validate account_id is provided
    if (!body.account_id) {
      throw new HttpException(
        'account_id is required in request body',
        HttpStatus.BAD_REQUEST
      );
    }

    // Step 1: Get current patient to check if already has account
    let currentPatient: PatientResponseDto;
    try {
      currentPatient = await firstValueFrom(
        this.patientClient.send(PatientMessages.GET_PATIENT_BY_ID, id).pipe(
          timeout(3000),
          catchError((error) => {
            throw new HttpException(
              error.message || `Patient with ID ${id} not found`,
              error.statusCode || HttpStatus.NOT_FOUND
            );
          })
        )
      );
    } catch (error) {
      throw error;
    }

    // Step 2: Check if patient already has an account
    if (currentPatient.account_id) {
      throw new HttpException(
        `Patient already linked to account ID ${currentPatient.account_id}. ` +
        `Cannot link to another account. Please unlink first if you want to change the account.`,
        HttpStatus.CONFLICT
      );
    }

    // Step 3: Verify the new account exists
    try {
      await firstValueFrom(
        this.accountClient
          .send(AccountMessages.FIND_ONE_ACCOUNT, body.account_id)
          .pipe(
            timeout(3000),
            catchError((error) => {
              throw new HttpException(
                `Account with ID ${body.account_id} does not exist`,
                HttpStatus.BAD_REQUEST
              );
            })
          )
      );
    } catch (error) {
      throw error;
    }

    // Step 4: Update patient with account_id
    const result = await firstValueFrom(
      this.patientClient
        .send(PatientMessages.UPDATE_PATIENT, {
          id,
          dto: { account_id: body.account_id },
        })
        .pipe(
          timeout(5000),
          catchError((error) => {
            throw new HttpException(
              error.message || 'Failed to link account to patient',
              error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
          })
        )
    );

    console.log(
      `✅ Successfully linked patient ${id} to account ${body.account_id}`
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
