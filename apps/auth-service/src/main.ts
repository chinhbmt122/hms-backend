/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ClientConstant } from '@hms-backend/constants';
import { AccountModule } from './account.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AccountModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3003,
        host: 'localhost',
      },
    }
  );

  await app.listen();
  console.log(`Auth microservice listening`);
}

bootstrap();
