import { Medicine } from 'src/medicines/entities/medicine.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name', nullable: false })
    name: string;

    @OneToMany(() => Medicine, (medicine) => medicine.category)
    medicines: Medicine[];

    @Column({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column({ name: 'created_by', type: 'int', nullable: true })
    createdBy: number;

    @Column({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    @Column({ name: 'updated_by', type: 'int', nullable: true })
    updatedBy: number;
}
