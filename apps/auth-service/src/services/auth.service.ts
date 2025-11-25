import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { PasswordHashService } from './password-hash.service';
import { TokenService, TokenPair } from './token.service';
import { AccountResponseDto } from '@hms-backend/dto';
import { AccountMapper } from '../account.mapper';

export interface LoginResponse {
  account: AccountResponseDto;
  tokens: TokenPair;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly passwordHashService: PasswordHashService,
    private readonly tokenService: TokenService,
    private readonly accountMapper: AccountMapper
  ) {}

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // Find account by email
    const account = await this.accountRepository.findOne({
      where: { email },
    });

    if (!account) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await this.passwordHashService.comparePassword(
      password,
      account.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if account is deleted (soft delete)
    if (account.deletedAt) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    // Generate tokens
    const tokens = await this.tokenService.generateTokenPair(account);

    // Return account data (without password) and tokens
    return {
      account: await this.accountMapper.toResponseDto(account),
      tokens,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    // Verify refresh token
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);

    // Get account
    const account = await this.accountRepository.findOne({
      where: { id: payload.sub },
    });

    if (!account) {
      throw new UnauthorizedException('Account not found');
    }

    if (account.deletedAt) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    // Revoke old refresh token
    await this.tokenService.revokeRefreshToken(refreshToken);

    // Generate new token pair
    return this.tokenService.generateTokenPair(account);
  }

  /**
   * Logout - revoke refresh token
   */
  async logout(refreshToken: string): Promise<{ message: string }> {
    await this.tokenService.revokeRefreshToken(refreshToken);
    return { message: 'Logout successful' };
  }

  /**
   * Logout from all devices - revoke all refresh tokens
   */
  async logoutAll(accountId: number): Promise<{ message: string }> {
    await this.tokenService.revokeAllRefreshTokens(accountId);
    return { message: 'Logged out from all devices successfully' };
  }

  /**
   * Change password
   */
  async changePassword(
    accountId: number,
    oldPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    // Get account
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    // Verify old password
    const isPasswordValid = await this.passwordHashService.comparePassword(
      oldPassword,
      account.password
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword =
      await this.passwordHashService.hashPassword(newPassword);

    // Update password
    await this.accountRepository.update(accountId, {
      password: hashedPassword,
    });

    // Revoke all existing refresh tokens for security
    await this.tokenService.revokeAllRefreshTokens(accountId);

    return { message: 'Password changed successfully. All sessions logged out.' };
  }

  /**
   * Validate account by ID (used by JWT strategy)
   */
  async validateAccount(accountId: number): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account || account.deletedAt) {
      throw new UnauthorizedException('Account not found or deactivated');
    }

    return account;
  }
}
