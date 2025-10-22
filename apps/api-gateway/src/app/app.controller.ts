import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiGatewayController {
  @Get()
  getHealthCheck() {
    return {
      status: 'ok',
      message: 'API Gateway is running',
      timestamp: new Date().toISOString(),
      endpoints: {
        patients: '/api/patients',
        health: '/api',
      },
    };
  }
}
