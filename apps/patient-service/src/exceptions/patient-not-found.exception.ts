import { RpcException } from '@nestjs/microservices';

export class PatientNotFoundException extends RpcException {
  constructor(id: number | string) {
    super({
      statusCode: 404,
      message: `Patient with ID ${id} not found`,
      error: 'PATIENT_NOT_FOUND',
    });
  }
}
