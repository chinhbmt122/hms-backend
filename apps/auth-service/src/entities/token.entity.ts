import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TokenType } from '../constants/token-type';
import { Account } from './account.entity';

@Entity()
export class Tokens {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column({ type: 'enum', enum: TokenType })
  type: TokenType;

  @Column()
  expiredAt: Date;

  @ManyToOne(() => Account, (account) => account.tokens, {
    onDelete: 'CASCADE',
  })
  account: Account;
}
