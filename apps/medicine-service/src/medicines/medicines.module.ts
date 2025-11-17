import { Module } from '@nestjs/common';
import { MedicinesController } from './medicines.controller';
import { MedicinesService } from './medicines.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicine } from './entities/medicine.entity';
import { Category } from 'src/categories/entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Medicine, Category])],
    controllers: [MedicinesController],
    providers: [MedicinesService],
})
export class MedicinesModule {}
