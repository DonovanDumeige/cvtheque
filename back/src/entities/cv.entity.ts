import { TimeStampEntity } from 'src/Generics/timestamp.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('cv')
export class CvEntity extends TimeStampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 50 })
    firstname: string;

    @Column()
    age: number;

    @Column()
    cin: number;

    @Column()
    job: string;

    @Column()
    path: string;

    @ManyToOne(() => UserEntity, (user) => user.cv, {
        cascade: true,
        nullable: true,
        eager: true,
    })
    user: UserEntity;
}
