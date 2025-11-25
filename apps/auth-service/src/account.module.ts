import { Module } from '@nestjs/common';
import { AccountController } from './app/account.controller';
import { AccountService } from './services/accounts.service';
import { AccountMapper } from './account.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Account } from './entities/account.entity';
import { Tokens } from './entities/token.entity';
import { PasswordHashService } from './services/password-hash.service';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Tokens]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST', 'localhost'),
        port: configService.get<number>('POSTGRES_PORT', 5434),
        username: configService.get<string>('POSTGRES_USER', 'hospital'),
        password: configService.get<string>('POSTGRES_PASSWORD', 'hospital123'),
        database: configService.get<string>('POSTGRES_DB', 'auth_db'),
        entities: [Account, Tokens],
        synchronize: true,
        logging: true,
      }),
    }),
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AccountController],
  providers: [
    {
      provide: 'IAccountService',
      useClass: AccountService,
    },
    AccountMapper,
    PasswordHashService,
    TokenService,
    AuthService,
  ],
  exports: [AccountMapper, PasswordHashService, TokenService, AuthService],
})
export class AccountModule {}
