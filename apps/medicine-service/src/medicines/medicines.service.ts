import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine } from './entities/medicine.entity';
import { MedicineResponse } from './dto/medicine-response.dto';
import { plainToInstance } from 'class-transformer';
import { MedicineRequest } from './dto/medicine-request.dto';
import { Category } from 'src/categories/entities/category.entity';
import { PageResponse } from 'src/common/dto/page-response';
import { parse } from '@rsql/parser';
import { applyRsql } from 'src/common/utils/ASTHelper';

@Injectable()
export class MedicinesService {
    constructor(
        @InjectRepository(Medicine)
        private readonly medicineRepository: Repository<Medicine>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}
    async findAll(
        page: number,
        limit: number,
        filter: string | undefined,
    ): Promise<PageResponse<MedicineResponse>> {
        const qb = this.medicineRepository
            .createQueryBuilder('medicine')
            .leftJoinAndSelect('medicine.category', 'category');

        if (filter) {
            const ast = parse(filter);
            applyRsql(qb, ast, 'medicine');
        }
        qb.skip((page - 1) * limit).take(limit);
        const [medicines, totalItems] = await qb.getManyAndCount();

        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: plainToInstance(MedicineResponse, medicines, {
                excludeExtraneousValues: true,
            }),
            pagination: {
                totalItems,
                totalPages,
                limit,
                page,
            },
        };
    }

    async findOne(id: number): Promise<MedicineResponse> {
        const medicine = await this.medicineRepository.findOne({
            where: { id },
            relations: ['category'],
        });
        if (!medicine) throw new NotFoundException(`Medicine with ID ${id} not found`);
        return plainToInstance(MedicineResponse, medicine, {
            excludeExtraneousValues: true,
        });
    }

    async create(dto: MedicineRequest): Promise<MedicineResponse> {
        const medicine = this.medicineRepository.create(dto);

        if (dto.categoryId) {
            const category = await this.categoryRepository.findOneBy({ id: dto.categoryId });
            if (!category)
                throw new NotFoundException(`Category with ID ${dto.categoryId} not found`);
            medicine.category = category;
        }

        const saved = await this.medicineRepository.save(medicine);
        return plainToInstance(MedicineResponse, saved, { excludeExtraneousValues: true });
    }

    async update(id: number, dto: MedicineRequest): Promise<MedicineResponse> {
        const medicine = await this.medicineRepository.findOne({
            where: { id },
            relations: ['category'],
        });
        if (!medicine) throw new NotFoundException(`Medicine with ID ${id} not found`);

        Object.assign(medicine, dto);

        if (dto.categoryId) {
            const category = await this.categoryRepository.findOneBy({ id: dto.categoryId });
            if (!category)
                throw new NotFoundException(`Category with ID ${dto.categoryId} not found`);
            medicine.category = category;
        }

        const updated = await this.medicineRepository.save(medicine);
        return plainToInstance(MedicineResponse, updated, {
            excludeExtraneousValues: true,
        });
    }

    async remove(id: number): Promise<void> {
        const result = await this.medicineRepository.delete(id);
        if (result.affected === 0)
            throw new NotFoundException(`Medicine with ID ${id} not found`);
    }

    async removeAll(ids: number[]): Promise<void> {
        const result = await this.medicineRepository.delete(ids);
        if (result.affected === 0)
            throw new NotFoundException(`No medicines found for the provided IDs`);
    }
}
