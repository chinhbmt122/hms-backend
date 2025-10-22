import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { PatientService } from './patient.service';
import { Patient } from '../entities/patient.entity';
import { databaseConfig } from '../config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      envFilePath: '.env', // Path to .env file
    }),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Patient]),
  ],
  controllers: [AppController],
  providers: [PatientService],
})
export class AppModule {}
