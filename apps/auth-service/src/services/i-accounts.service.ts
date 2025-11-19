import {
  AccountResponseDto,
  CreateAccountDto,
  PaginatedResult,
  QueryAccountDto,
  UpdateAccountDto,
} from '../../../../libs/shared/dto/src';
import { Account } from '../entities/account.entity';

export interface IAccountService {
  create(createAccountDto: CreateAccountDto): Promise<AccountResponseDto>;
  update(id: number, updateAccountDto: UpdateAccountDto): Promise<number>;
  findOne(id: number): Promise<AccountResponseDto>;
  findAll(query: QueryAccountDto): Promise<PaginatedResult<AccountResponseDto>>;
  findByEmail(email: string): Promise<Account>;
  remove(id: number): Promise<void>;
  restore(id: number): Promise<number>;
}
