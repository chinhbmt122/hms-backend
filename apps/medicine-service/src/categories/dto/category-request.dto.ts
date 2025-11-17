import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryRequest {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}
