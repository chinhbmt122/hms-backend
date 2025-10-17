import { Controller, Get } from '@nestjs/common';
import { ApiGatewayService } from './app.service';
import { ClientFactory } from './Clients/ClientFactory';
import { ClientConstant, PatientMessages } from '@hms-backend/constants';

@Controller()
export class ApiGatewayController {
  constructor(private readonly gatewayService: ApiGatewayService) {}

  @Get('/users')
  async getUsers() {
    const client = ClientFactory.getInstance().getClient(
      ClientConstant.PATIENT_SERVICE
    );

    return client.send(PatientMessages.CREATE_PATIENT, {});
  }

  @Get()
  async getAuth() {
    return this.gatewayService.getUsers();
  }
}
