import { Module } from '@nestjs/common';
import { AccountController } from './app/account.controller';
import { AccountService } from './services/accounts.service';
import { AccountMapper } from './account.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Account } from './entities/account.entity';
import { Tokens } from './entities/token.entity';

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
        type: 'mysql',
        host: configService.get<string>('ACCOUNT_DB_HOST'),
        port: configService.get<number>('ACCOUNT_DB_PORT'),
        username: configService.get<string>('ACCOUNT_DB_USERNAME'),
        password: configService.get<string>('ACCOUNT_DB_PASSWORD'),
        database: configService.get<string>('ACCOUNT_DB_NAME'),
        entities: [Account, Tokens],
        synchronize: true,
        logging: true,
      }),
    }),
  ],
  controllers: [AccountController],
  providers: [
    {
      provide: 'IAccountService',
      useClass: AccountService,
    },
    AccountMapper,
  ],
  exports: [AccountMapper],
})
export class AccountModule {}
