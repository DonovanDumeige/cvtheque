import { Role } from 'src/Generics/enums/roles.enum';
import { TimeStampEntity } from 'src/Generics/timestamp.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CvEntity } from './cv.entity';

@Entity('user')
export class UserEntity extends TimeStampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
        unique: true,
    })
    username: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: string;

    @OneToMany(() => CvEntity, (cv) => cv.user, {
        nullable: true,
        cascade: ['insert', 'update'],
    })
    cv: CvEntity[];
}
