import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from '@hms-backend/dto';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  account_id: number;

  @Column({ type: 'varchar', nullable: false })
  full_name: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth?: Date;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: false,
  })
  gender: Gender;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number?: string;

  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  id_card?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  health_insurance_number?: string;

  @Column({ type: 'varchar', nullable: true })
  relative_full_name?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  relative_phone_number?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
