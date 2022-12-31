import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { userCreateDto } from './dto/user-create.dto';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/Generics/enums/roles.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        private jwtService: JwtService,
    ) {}

    async signin(userDto: userCreateDto): Promise<Partial<UserEntity>> {
        const user = this.userRepo.create({
            ...userDto,
        });
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, user.salt);
        try {
            await this.userRepo.save(user);
        } catch (e) {
            throw new ConflictException(
                "Le username et l'email doivent être uniques",
            );
        }
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };
    }

    async login(dto: loginDto) {
        const { username, password } = dto;

        const user = await this.userRepo
            .createQueryBuilder('user')
            .where('user.username = :username or user.email = :username', {
                username,
            })
            .getOne();
        if (!user) throw new NotFoundException('username ou password erroné');

        const hashedPass = await bcrypt.hash(password, user.salt);
        if (hashedPass === user.password) {
            const payload = {
                username: user.username,
                email: user.email,
                role: user.role,
            };
            const jwt = await this.jwtService.sign(payload);
            return {
                access_token: jwt,
            };
        } else {
            throw new NotFoundException('username ou password erroné');
        }
    }

    isOwnerOrAdmin(objet, user) {
        return (
            user.role === Role.ADMIN ||
            (objet.user && objet.user.id === user.id)
        );
    }
}
