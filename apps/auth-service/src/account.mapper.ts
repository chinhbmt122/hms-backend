import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Account } from './entities/account.entity';
import {
  AccountResponseDto,
  PaginatedResult,
} from '../../../libs/shared/dto/src/index';
import { getAccountStatus } from './utils';

@Injectable()
export class AccountMapper {
  toResponseDto = async (account: Account) => {
    const accountResponse = new AccountResponseDto();

    //mapping data
    accountResponse.id = account.id;
    accountResponse.email = account.email;
    accountResponse.isVerifiedEmail = account.emailVerified;
    accountResponse.createdAt = account.createdAt;
    accountResponse.updatedAt = account.updatedAt;
    accountResponse.deletedAt = account.deletedAt;

    accountResponse.status = getAccountStatus(account);
    accountResponse.role = account.role;

    return accountResponse;
  };

  toPaginationResponseDto = async (
    accounts: PaginatedResult<Account>
  ): Promise<PaginatedResult<AccountResponseDto>> => {
    //mapping pagination
    const paginationDto = new PaginatedResult<AccountResponseDto>();

    //mapping
    paginationDto.data = await Promise.all(
      accounts.data.map((account) => this.toResponseDto(account))
    );
    paginationDto.meta = accounts.meta;

    return paginationDto;
  };
}
