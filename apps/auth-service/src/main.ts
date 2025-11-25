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
  const port = parseInt(process.env.TCP_PORT || '3003', 10);
  const host = process.env.TCP_HOST || '0.0.0.0';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AccountModule,
    {
      transport: Transport.TCP,
      options: {
        port,
        host,
      },
    }
  );

  await app.listen();
  console.log(`Auth microservice listening on ${host}:${port}`);
}

bootstrap();
