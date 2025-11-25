import { IntersectionType, OmitType } from '@nestjs/swagger';
import { CreateAccountDto } from '../account/request/create-account.dto';
import { CreatePatientDto } from './create-patient.dto';

/**
 * RegisterPatientDto combines CreateAccountDto and CreatePatientDto
 * - Includes all account fields (email, password)
 * - Includes all patient fields EXCEPT account_id (will be auto-generated)
 */
export class RegisterPatientDto extends IntersectionType(
  CreateAccountDto,
  OmitType(CreatePatientDto, ['account_id'] as const)
) {}
