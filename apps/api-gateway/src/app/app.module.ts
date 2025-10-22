import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiGatewayController } from './app.controller';
import { ApiGatewayService } from './app.service';
import { PatientController } from './controllers/patient.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      envFilePath: '.env', // Path to .env file
    }),
    HttpModule,
  ],
  controllers: [ApiGatewayController, PatientController],
  providers: [ApiGatewayService],
})
export class AppModule {}
