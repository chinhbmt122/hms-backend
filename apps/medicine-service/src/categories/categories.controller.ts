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
import { CategoriesService } from './categories.service';
import { CategoryResponse } from './dto/category-response.dto';
import { CategoryRequest } from './dto/category-request.dto';
import { PageResponse } from 'src/common/dto/page-response';
import { Message } from 'src/common/decorators/message.decorator';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @Message('Lấy danh sách loại thuốc thành công')
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ): Promise<PageResponse<CategoryResponse>> {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        return this.categoriesService.findAll(pageNumber, limitNumber);
    }

    @Get(':id')
    @Message('Lấy thông tin loại thuốc thành công')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponse> {
        return this.categoriesService.findOne(id);
    }

    @Post()
    @Message('Tạo loại thuốc thành công')
    create(@Body() request: CategoryRequest) {
        return this.categoriesService.create(request);
    }

    @Put(':id')
    @Message('Cập nhật loại thuốc thành công')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() request: CategoryRequest,
    ): Promise<CategoryResponse> {
        return this.categoriesService.update(id, request);
    }

    @Delete(':id')
    @Message('Xóa loại thuốc thành công')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.categoriesService.remove(id);
    }

    @Delete()
    @Message('Xóa nhiều loại thuốc thành công')
    removeAll(@Query('ids') ids: string): Promise<void> {
        const idArray = ids.split(',').map((id) => +id);
        return this.categoriesService.removeAll(idArray);
    }
}
