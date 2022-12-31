import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    UpdateDateColumn,
} from 'typeorm';

export class TimeStampEntity {
    @CreateDateColumn({ update: false })
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;
}
