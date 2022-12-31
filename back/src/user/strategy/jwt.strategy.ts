import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PayLoadInterface } from '../interface/payload.interface';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private config: ConfigService,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('SECRET'),
        });
    }

    async validate(payload: PayLoadInterface) {
        const user = await this.userRepo.findOneBy({
            username: payload.username,
        });

        /* Si l'user existe je le retourne. Automatiquement ce que je retourne dans
        validate est mis dans le request.
        Sinon je déclenche une erreur. */

        if (user) {
            const { password, salt, ...result } = user;
            return result;
        } else {
            throw new UnauthorizedException();
        }
    }
}
