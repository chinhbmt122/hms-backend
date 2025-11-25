import { Module } from '@nestjs/common';
import { ApiGatewayController } from './app.controller';
import { ApiGatewayService } from './app.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class AppModule {}
