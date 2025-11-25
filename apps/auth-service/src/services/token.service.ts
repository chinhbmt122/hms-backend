import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tokens } from '../entities/token.entity';
import { TokenType } from '../constants/token-type';
import { Account } from '../entities/account.entity';

export interface JwtPayload {
  sub: number; // account id
  email: string;
  role: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Tokens)
    private readonly tokenRepository: Repository<Tokens>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>
  ) {}

  /**
   * Generate access and refresh token pair
   */
  async generateTokenPair(account: Account): Promise<TokenPair> {
    const payload = {
      sub: account.id,
      email: account.email,
      role: account.role,
    };

    // Generate tokens
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env['JWT_ACCESS_SECRET'] || 'access-secret-key',
      expiresIn: (process.env['JWT_ACCESS_EXPIRATION'] || '15m') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env['JWT_REFRESH_SECRET'] || 'refresh-secret-key',
      expiresIn: (process.env['JWT_REFRESH_EXPIRATION'] || '7d') as any,
    });

    // Store refresh token in database
    await this.storeRefreshToken(account, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Store refresh token in database
   */
  private async storeRefreshToken(
    account: Account,
    token: string
  ): Promise<void> {
    const decoded = this.jwtService.decode(token) as any;
    const expiredAt = new Date(decoded.exp * 1000);

    await this.tokenRepository.save({
      value: token,
      type: TokenType.REFRESH_TOKEN,
      expiredAt,
      account,
    });
  }

  /**
   * Verify and decode access token
   */
  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'access-secret-key',
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  /**
   * Verify and decode refresh token
   */
  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
      });

      // Check if token exists in database and is not expired
      const storedToken = await this.tokenRepository.findOne({
        where: {
          value: token,
          type: TokenType.REFRESH_TOKEN,
        },
        relations: ['account'],
      });

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      if (storedToken.expiredAt < new Date()) {
        throw new UnauthorizedException('Refresh token expired');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Revoke a refresh token
   */
  async revokeRefreshToken(token: string): Promise<void> {
    await this.tokenRepository.delete({
      value: token,
      type: TokenType.REFRESH_TOKEN,
    });
  }

  /**
   * Revoke all refresh tokens for an account
   */
  async revokeAllRefreshTokens(accountId: number): Promise<void> {
    const result = await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .from(Tokens)
      .where('type = :type', { type: TokenType.REFRESH_TOKEN })
      .andWhere('accountId = :accountId', { accountId })
      .execute();

    console.log(`Revoked ${result.affected} refresh tokens for account ${accountId}`);
  }

  /**
   * Clean up expired tokens (should be run periodically)
   */
  async cleanupExpiredTokens(): Promise<void> {
    await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .where('expiredAt < :now', { now: new Date() })
      .execute();
  }
}
