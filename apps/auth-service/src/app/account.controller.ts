import { Controller, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AccountResponseDto,
  CreateAccountDto,
  PaginatedResult,
  QueryAccountDto,
  UpdateAccountDto,
} from '@hms-backend/dto';
import { AccountMessages } from '@hms-backend/constants';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IAccountService } from '../services/i-accounts.service';

@ApiTags('Account')
@Controller() // Bỏ 'api/accounts' vì microservice không dùng HTTP routes
export class AccountController {
  constructor(
    @Inject('IAccountService')
    private readonly accountsService: IAccountService
  ) {}

  @MessagePattern(AccountMessages.CREATE_ACCOUNT)
  async create(
    @Payload() createAccountDto: CreateAccountDto
  ): Promise<AccountResponseDto> {
    console.log(createAccountDto);

    return this.accountsService.create(createAccountDto);
  }

  @MessagePattern(AccountMessages.FIND_ALL_ACCOUNTS)
  async findAll(
    @Payload() query: QueryAccountDto
  ): Promise<PaginatedResult<AccountResponseDto>> {
    return await this.accountsService.findAll(query);
  }

  @MessagePattern(AccountMessages.FIND_ONE_ACCOUNT)
  async findOne(@Payload() id: number): Promise<AccountResponseDto> {
    return await this.accountsService.findOne(id);
  }

  @MessagePattern(AccountMessages.UPDATE_ACCOUNT)
  async update(
    @Payload() data: { id: number; dto: UpdateAccountDto }
  ): Promise<number> {
    return await this.accountsService.update(data.id, data.dto);
  }

  @MessagePattern(AccountMessages.RESTORE_ACCOUNT)
  async restore(@Payload() id: number) {
    return await this.accountsService.restore(id);
  }

  @MessagePattern(AccountMessages.REMOVE_ACCOUNT)
  async remove(@Payload() id: number) {
    this.accountsService.remove(id);
    return 1;
  }
}
