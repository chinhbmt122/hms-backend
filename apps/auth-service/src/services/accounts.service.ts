import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountMapper } from '../account.mapper';
import {
  AccountResponseDto,
  CreateAccountDto,
  PaginatedResult,
  QueryAccountDto,
  UpdateAccountDto,
} from '@hms-backend/dto';
import { Account } from '../entities/account.entity';
import { IAccountService } from './i-accounts.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @Inject() private readonly accountsMapper: AccountMapper
  ) {}

  /**
   *
   * @param createAccountDto
   * @Step1 create account by account repository
   * @Step2 return response dto by account mapper
   * @returns
   */
  async create(
    createAccountDto: CreateAccountDto
  ): Promise<AccountResponseDto> {
    //create account
    const createdAccount = await this.accountRepository.save(createAccountDto);

    //mapping data to response dto
    return await this.accountsMapper.toResponseDto(createdAccount);
  }

  async findAll(
    query: QueryAccountDto
  ): Promise<PaginatedResult<AccountResponseDto>> {
    const result = await this.accountRepository.findAndCount({
      take: query.limit,
      skip: (query.page - 1) * query.limit,
    });

    return this.accountsMapper.toPaginationResponseDto({
      data: result[0],
      meta: {
        limit: query.limit,
        page: query.page,
        totalElements: result[1],
      },
    });
  }

  /**
   *
   * @param id
   * @returns
   */
  async findOne(id: number): Promise<AccountResponseDto> {
    //find by id
    const foundAccount = await this.accountRepository.findOneBy({
      id,
    });

    //not found => 404 error
    if (!foundAccount) throw new NotFoundException('Account not found!');

    //return response dto by account mapper
    return this.accountsMapper.toResponseDto(foundAccount);
  }

  /**
   *
   * @param id
   * @check email already in used by another account
   * @param updateAccountDto
   */
  async update(
    id: number,
    updateAccountDto: UpdateAccountDto
  ): Promise<number> {
    //check new email was already in used by another account?
    if (updateAccountDto.email) {
      await this.checkEmailAlreadyInUsedByAnotherAccount(
        id,
        updateAccountDto.email
      );
    }

    //update
    const updatedAccount = await this.accountRepository.update(
      id,
      updateAccountDto
    );

    return updatedAccount.affected;
  }

  async checkEmailAlreadyInUsedByAnotherAccount(
    accountId: number,
    email: string
  ) {
    if (email) {
      const foundAccount = await this.accountRepository.findOneBy({ email });
      if (foundAccount && accountId != foundAccount.id)
        throw new BadRequestException('Email already existed');
    }
  }

  /**
   * @title soft delete by id
   * @param id
   */
  async remove(id: number): Promise<void> {
    console.log(id);

    await this.accountRepository.softDelete({ id });
  }

  /**
   *
   * @title restore by id
   * @param id
   * @returns
   */
  async restore(id: number): Promise<number> {
    const restoredAccount = await this.accountRepository.restore(id);

    return restoredAccount.affected;
  }

  /**
   *
   * @param email
   * @returns
   */
  async findByEmail(email: string): Promise<Account> {
    const foundAccount = await this.accountRepository.findOneBy({ email });

    //not found => 400 error
    if (!foundAccount)
      throw new BadRequestException('Email not match any accounts!');

    return foundAccount;
  }
}
