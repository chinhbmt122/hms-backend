import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseIntPipe,
  Query,
  UseGuards,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError } from 'rxjs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  AccountResponseDto,
  CreateAccountDto,
  PaginatedResult,
  QueryAccountDto,
  UpdateAccountDto,
} from '@hms-backend/dto';
import { AccountMessages, AccountStatus } from '@hms-backend/constants';
import { enumToArray } from 'libs/shared/utils/src/index';

const MS_TIMEOUT = 5000;

@ApiTags('Account')
@ApiBearerAuth()
// @UseGuards(AccessAuthGuard) // Áp dụng Guard cho tất cả các endpoint (trừ `getEnumAccountStatus`)
@Controller('accounts')
export class AccountController {
  constructor(
    // Thay thế 'IAccountService' bằng tên token của Microservice Client
    @Inject('ACCOUNT_SERVICE') private readonly accountClient: ClientProxy
  ) {}

  /**
   * Phương thức chung để xử lý gửi thông điệp tới Microservice
   * @param pattern - Message pattern
   * @param data - Dữ liệu gửi đi
   * @returns Kết quả từ Microservice
   */
  private async sendToMicroservice<T>(pattern: string, data: any): Promise<T> {
    try {
      return await firstValueFrom(
        this.accountClient.send(pattern, data).pipe(
          timeout(MS_TIMEOUT), // Thiết lập thời gian chờ
          catchError((error) => {
            console.log(error);

            // Ném HttpException với mã lỗi và thông báo từ Microservice
            throw new HttpException(
              error.message || `${pattern} service unavailable`,
              error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
          })
        )
      );
    } catch (error) {
      // Đảm bảo lỗi được ném ra đúng cách (ví dụ: TimeoutException)
      if (error instanceof HttpException) {
        throw error;
      }

      console.log(error);

      throw new HttpException(
        'Internal Server Error or Microservice Timeout',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // --- 1. Tạo Account ---
  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
  })
  async create(
    @Body(ValidationPipe) createAccountDto: CreateAccountDto
  ): Promise<AccountResponseDto> {
    return this.sendToMicroservice<AccountResponseDto>(
      AccountMessages.CREATE_ACCOUNT,
      createAccountDto
    );
  }

  // --- 2. Lấy danh sách Accounts (Phân trang) ---
  @Get()
  @ApiOperation({ summary: 'Get all accounts with pagination' })
  @ApiQuery({ type: QueryAccountDto })
  @ApiResponse({
    status: 200,
    description: 'List of accounts retrieved successfully',
  })
  async findAll(
    @Query(ValidationPipe) query: QueryAccountDto
  ): Promise<PaginatedResult<AccountResponseDto>> {
    return this.sendToMicroservice<PaginatedResult<AccountResponseDto>>(
      AccountMessages.FIND_ALL_ACCOUNTS,
      query
    );
  }

  // --- 3. Lấy Account theo ID ---
  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Account ID' })
  @ApiResponse({
    status: 200,
    description: 'Account retrieved successfully',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<AccountResponseDto> {
    console.log('casacs');

    return this.sendToMicroservice<AccountResponseDto>(
      AccountMessages.FIND_ONE_ACCOUNT,
      id
    );
  }

  // --- 4. Lấy Enum Account Status (Endpoint này không cần Microservice) ---
  @ApiOperation({ summary: 'Get enum account status' })
  @Get('/constants/account-status')
  @UseGuards() // Bỏ UseGuards để cho phép truy cập công khai nếu cần, hoặc giữ nguyên để yêu cầu token
  getEnumAccountStatus() {
    return enumToArray(AccountStatus);
  }

  // --- 5. Cập nhật Account ---
  @Patch(':id')
  @ApiOperation({ summary: 'Update account by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Account ID' })
  @ApiResponse({
    status: 200,
    description:
      'Account updated successfully (Trả về số lượng row bị ảnh hưởng)',
    type: Number,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateAccountDto: UpdateAccountDto
  ): Promise<number> {
    return this.sendToMicroservice<number>(AccountMessages.UPDATE_ACCOUNT, {
      id,
      dto: updateAccountDto,
    });
  }

  // --- 6. Khôi phục Account (Restore) ---
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore account by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Account ID' })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.sendToMicroservice<any>(AccountMessages.RESTORE_ACCOUNT, id);
  }

  // --- 7. Xóa Account (Remove/Soft Delete) ---
  @Delete(':id')
  @ApiOperation({ summary: 'Delete account by ID (Soft Delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Account ID' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.sendToMicroservice<any>(AccountMessages.REMOVE_ACCOUNT, id);
  }
}
