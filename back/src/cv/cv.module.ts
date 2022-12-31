import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvEntity } from 'src/entities/cv.entity';
import { UserModule } from 'src/user/user.module';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';

@Module({
    imports: [TypeOrmModule.forFeature([CvEntity]), UserModule],
    controllers: [CvController],
    providers: [CvService],
})
export class CvModule {}
