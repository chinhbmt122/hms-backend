import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { PatientMessages } from '@hms-backend/constants';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly clientAuthService: ClientProxy,
    @Inject('EMAIL_SERVICE') private readonly clientEmailService: ClientProxy
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/login')
  login() {
    return this.clientAuthService.send<string>('auth.login', {
      username: 'phucCuTo',
      password: 'phuc@123',
    });
  }

  @Get('/email')
  email() {
    return this.clientEmailService.send<string>(
      PatientMessages.CREATE_PATIENT,
      {
        email: 'email@123',
      }
    );
  }
}
