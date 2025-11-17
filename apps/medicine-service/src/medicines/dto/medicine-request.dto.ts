import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDate, IsInt } from 'class-validator';

export class MedicineRequest {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    activeIngredient?: string;

    @ApiProperty()
    @IsString()
    unit: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    quantity?: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    concentration?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    packaging?: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    purchasePrice?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    sellingPrice?: number;

    @ApiProperty()
    @IsOptional()
    @IsDate()
    expiresAt?: Date;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    categoryId?: number;
}
