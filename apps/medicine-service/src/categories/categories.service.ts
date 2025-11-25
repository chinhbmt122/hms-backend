import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryRequest } from './dto/category-request.dto';
import { CategoryResponse } from './dto/category-response.dto';
import { plainToInstance } from 'class-transformer';
import { PageResponse } from 'src/common/dto/page-response';
import { parse } from '@rsql/parser';
import { applyRsql } from 'src/common/utils/ASTHelper';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async findAll(
        page: number,
        limit: number,
        filter: string | undefined,
    ): Promise<PageResponse<CategoryResponse>> {
        const qb = this.categoryRepository.createQueryBuilder('category');
        if (filter) {
            const ast = parse(filter);
            applyRsql(qb, ast, 'category');
        }
        qb.skip((page - 1) * limit).take(limit);
        const [categories, totalItems] = await qb.getManyAndCount();
        const totalPages = Math.ceil(totalItems / limit);
        categories.map((category) => plainToInstance(CategoryResponse, category));
        return {
            data: categories.map((category) => plainToInstance(CategoryResponse, category)),
            pagination: {
                totalItems,
                limit,
                totalPages,
                page,
            },
        };
    }

    async findOne(id: number): Promise<CategoryResponse> {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return plainToInstance(CategoryResponse, category);
    }

    async create(request: CategoryRequest): Promise<CategoryResponse> {
        const category = this.categoryRepository.create(request);
        const savedCategory = await this.categoryRepository.save(category);
        return plainToInstance(CategoryResponse, savedCategory);
    }

    async update(id: number, request: CategoryRequest): Promise<CategoryResponse> {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        Object.assign(category, request);
        const updatedCategory = await this.categoryRepository.save(category);
        return plainToInstance(CategoryResponse, updatedCategory);
    }

    async remove(id: number): Promise<void> {
        const result = await this.categoryRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
    }

    async removeAll(ids: number[]): Promise<void> {
        const result = await this.categoryRepository.delete(ids);
        if (result.affected === 0) {
            throw new NotFoundException(`No categories found for the provided IDs`);
        }
    }
}
