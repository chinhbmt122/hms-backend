import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Patient } from '../entities/patient.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.PATIENT_DB_HOST || 'localhost',
  port: parseInt(process.env.PATIENT_DB_PORT || '5433', 10),
  accountname: process.env.POSTGRES_USER || 'hospital',
  password: process.env.POSTGRES_PASSWORD || 'hospital123',
  database: process.env.PATIENT_DB_NAME || 'patient_db',
  entities: [Patient],
  synchronize: process.env.TYPEORM_SYNC === 'true' || true, // Set to false in production
  logging: process.env.TYPEORM_LOGGING === 'true' || false,
};
