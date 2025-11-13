import { IsString, IsOptional, IsNumber, IsDate, IsInt } from 'class-validator';

export class MedicineRequest {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    activeIngredient?: string;

    @IsString()
    unit: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    quantity?: number;

    @IsOptional()
    @IsString()
    concentration?: string;

    @IsOptional()
    @IsString()
    packaging?: string;

    @IsOptional()
    @IsNumber()
    purchasePrice?: number;

    @IsOptional()
    @IsNumber()
    sellingPrice?: number;

    @IsOptional()
    @IsDate()
    expiresAt?: Date;

    @IsOptional()
    @IsInt()
    categoryId?: number;
}
