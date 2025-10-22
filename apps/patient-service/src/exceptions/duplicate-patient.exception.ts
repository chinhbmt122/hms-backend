import { RpcException } from '@nestjs/microservices';

export class DuplicatePatientException extends RpcException {
  constructor(field: string, value: string) {
    super({
      statusCode: 409,
      message: `Patient with ${field} '${value}' already exists`,
      error: 'DUPLICATE_PATIENT',
    });
  }
}
