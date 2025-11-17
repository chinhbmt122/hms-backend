import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { MedicineResponse } from './dto/medicine-response.dto';
import { MedicineRequest } from './dto/medicine-request.dto';
import { PageResponse } from 'src/common/dto/page-response';
import { Message } from 'src/common/decorators/message.decorator';
import { ApiQuery } from '@nestjs/swagger';

@Controller('medicines')
export class MedicinesController {
    constructor(private readonly medicinesService: MedicinesService) {}

    @Get()
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'filter', required: false })
    @Message('Lấy danh sách thuốc thành công')
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('filter') filter?: string,
    ): Promise<PageResponse<MedicineResponse>> {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        return this.medicinesService.findAll(pageNumber, limitNumber, filter);
    }

    @Get(':id')
    @Message('Lấy thông tin thuốc thành công')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<MedicineResponse> {
        return this.medicinesService.findOne(id);
    }

    @Post()
    @Message('Tạo thuốc thành công')
    create(@Body() dto: MedicineRequest): Promise<MedicineResponse> {
        return this.medicinesService.create(dto);
    }

    @Put(':id')
    @Message('Cập nhật thuốc thành công')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: MedicineRequest,
    ): Promise<MedicineResponse> {
        return this.medicinesService.update(id, dto);
    }

    @Delete(':id')
    @Message('Xóa thuốc thành công')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.medicinesService.remove(id);
    }

    @Delete()
    @Message('Xóa nhiều thuốc thành công')
    removeAll(@Query('ids') ids: string): Promise<void> {
        const idArray = ids.split(',').map((id) => +id);
        return this.medicinesService.removeAll(idArray);
    }
}
