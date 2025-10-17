import { ClientConstant } from '@hms-backend/constants';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

export class ClientFactory {
  private static instance: ClientFactory;
  private clients: Record<string, ClientProxy> = {};

  constructor() {
    const services: {
      name: ClientConstant;
      queue: string;
    }[] = [
      {
        name: ClientConstant.AUTH_SERVICE,
        queue: ClientConstant.AUTH_SERVICE,
      },
      {
        name: ClientConstant.PATIENT_SERVICE,
        queue: ClientConstant.PATIENT_SERVICE,
      },
      {
        name: ClientConstant.ORDER_SERVICE,
        queue: ClientConstant.ORDER_SERVICE,
      },
    ];

    services.forEach((s) => {
      this.clients[s.name] = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: s.queue,
          queueOptions: { durable: false },
        },
      });
    });
  }

  getClient(serviceName: ClientConstant): ClientProxy {
    const client = this.clients[serviceName];
    if (!client) throw new Error(`Client ${serviceName} not found`);
    return client;
  }

  public static getInstance(): ClientFactory {
    if (this.instance == null) this.instance = new ClientFactory();
    return this.instance;
  }
}
