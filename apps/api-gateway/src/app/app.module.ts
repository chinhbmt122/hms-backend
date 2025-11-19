import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientController } from './controllers/patient.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AccountController } from './controllers/account.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.register([
      {
        name: 'PATIENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ||
              'amqp://hospital:rabbitmq_hospital_pass_2024@localhost:5672',
          ],
          queue: 'patient',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'ACCOUNT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3003,
        },
      },
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [AppController, PatientController, AccountController],
  providers: [AppService],
})
export class AppModule {}
