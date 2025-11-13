import { Category } from 'src/categories/entities/category.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('medicines')
export class Medicine {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'active_ingredient', nullable: true })
    activeIngredient: string;

    @Column({ name: 'unit' })
    unit: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ name: 'quantity', type: 'int', nullable: true })
    quantity: number;

    @Column({ name: 'concentration', nullable: true })
    concentration: string;

    @Column({ name: 'packaging', nullable: true })
    packaging: string;

    @Column({ name: 'purchase_price', type: 'double precision', nullable: true })
    purchasePrice: number;

    @Column({ name: 'selling_price', type: 'double precision', nullable: true })
    sellingPrice: number;

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

    @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
    expiresAt: Date;

    @ManyToOne(() => Category, (category) => category.medicines)
    @JoinColumn({ name: 'category_id' })
    category: Category;
}
