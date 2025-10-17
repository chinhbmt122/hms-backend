import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthMessages, PatientMessages } from '@hms-backend/constants';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern(PatientMessages.CREATE_PATIENT)
  handleCreatePatient(@Payload() data: any) {
    console.log('Patient service received:', data);
    return { status: 'ok', received: data };
  }
}
