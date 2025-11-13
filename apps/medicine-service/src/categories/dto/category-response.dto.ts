import { Expose } from 'class-transformer';

export class CategoryResponse {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    createdAt: Date;

    @Expose()
    createdBy: number;

    @Expose()
    updatedAt: Date;

    @Expose()
    updatedBy: number;
}
