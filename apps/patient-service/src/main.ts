import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ClientConstant } from '@hms-backend/constants';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: ClientConstant.PATIENT_SERVICE,
        queueOptions: { durable: false },
      },
    }
  );

  await app.listen();
  console.log(`Patient microservice listening on queue "patient"`);
}

bootstrap();
