import {
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import { throwIfEmpty } from 'rxjs';
import { CvEntity } from 'src/entities/cv.entity';
import { Role } from 'src/Generics/enums/roles.enum';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AddCVDto } from './dto/add-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Injectable()
export class CvService {
    constructor(
        @InjectRepository(CvEntity)
        private cvRepo: Repository<CvEntity>,
        private userService: UserService,
    ) {}

    async getCvs(user) {
        console.log(user.role);
        if (user.role === Role.ADMIN) {
            return await this.cvRepo.find();
        } else {
            return await this.cvRepo.findBy({
                user: {
                    id: user.id,
                },
            });
        }
    }

    async findOneCv(id: number): Promise<CvEntity> {
        return await this.cvRepo.findOneBy({ id });
    }

    async getCvByID(id: number, user) {
        let cvError, roleError;
        const cv = await this.findOneCv(id);
        console.log('CV user ID : ', cv);
        if (!cv) throw new NotFoundException();

        if (this.userService.isOwnerOrAdmin(cv, user)) return cv;
        else throw new UnauthorizedException();
    }

    async addCv(cv: AddCVDto, user): Promise<CvEntity> {
        const newCV = this.cvRepo.create(cv);
        newCV.user = user;
        return await this.cvRepo.save(newCV);
    }

    async editCv(id: number, cv: UpdateCvDto, user) {
        let cvError, roleError;
        const upCv = await this.findOneCv(id);

        if (!upCv) cvError = `Le Cv d'id ${id} n'existe pas`;

        if (this.userService.isOwnerOrAdmin(upCv, user))
            return await this.cvRepo.save({ ...upCv, ...cv });
        else roleError = 'Accès non autorisé.';

        if (cvError || roleError) {
            const error = {
                status: HttpStatus.NOT_FOUND,
                message: {
                    notfound: cvError,
                    unauthorized: roleError,
                },
            };
            return error;
        }
    }

    async softDeleteCv(id: number, user) {
        const cv = await this.findOneCv(id);
        if (!cv) {
            throw new NotFoundException();
        }
        if (this.userService.isOwnerOrAdmin(cv, user))
            return this.cvRepo.softDelete(id);
        else throw new UnauthorizedException();
    }

    async restoreCv(id: number, user) {
        const cv = await this.cvRepo.findOne({
            withDeleted: true,
            where: { id },
        });
        console.log(cv);
        if (!cv) {
            throw new NotFoundException();
        }
        if (this.userService.isOwnerOrAdmin(cv, user))
            return this.cvRepo.restore(id);
        else throw new UnauthorizedException();
    }

    //Chercher les cv par tranche d'age
    async statCvNumberByAge(maxAge: number, minAge = 0) {
        // créer un queryBuilder. Prends un alias qui correspond
        //à l'entité avec laquelle interagir
        const qb = this.cvRepo.createQueryBuilder('cv');
        qb.select('cv.age, count(cv.id) as cvCount')
            .where('cv.age > :ageMin and cv.age < :ageMax ')
            .setParameters({ ageMin: minAge, ageMax: maxAge })
            .groupBy('cv.age');

        return await qb.getRawMany();
    }
}
