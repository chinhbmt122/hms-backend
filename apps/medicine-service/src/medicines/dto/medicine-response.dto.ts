import { Expose, Type } from 'class-transformer';
import { CategoryResponse } from 'src/categories/dto/category-response.dto';

export class MedicineResponse {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    activeIngredient?: string;

    @Expose()
    unit: string;

    @Expose()
    description?: string;

    @Expose()
    quantity?: number;

    @Expose()
    concentration?: string;

    @Expose()
    packaging?: string;

    @Expose()
    purchasePrice?: number;

    @Expose()
    sellingPrice?: number;

    @Expose()
    createdAt: Date;

    @Expose()
    createdBy?: number;

    @Expose()
    updatedAt: Date;

    @Expose()
    updatedBy?: number;

    @Expose()
    expiresAt?: Date;

    @Expose()
    @Type(() => CategoryResponse)
    category?: CategoryResponse;
}
