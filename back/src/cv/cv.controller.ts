import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    Request,
    UseGuards,
} from '@nestjs/common';
import { User } from 'src/Decorators/user.decorator';
import { CvEntity } from 'src/entities/cv.entity';
import { JwtAuthGuard } from 'src/user/guard/jwt-auth.guard';
import { CvService } from './cv.service';
import { AddCVDto } from './dto/add-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Controller('cv')
export class CvController {
    constructor(private cvService: CvService) {}
    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllCvs(@User() user): Promise<CvEntity[]> {
        return await this.cvService.getCvs(user);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async addCv(@Body() dto: AddCVDto, @User() user): Promise<CvEntity> {
        return await this.cvService.addCv(dto, user);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async editCv(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCvDto,
        @User() user,
    ) {
        return await this.cvService.editCv(id, dto, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteCv(@Param('id', ParseIntPipe) id: number, @User() user) {
        return await this.cvService.softDeleteCv(id, user);
    }

    @Get('recover/:id')
    @UseGuards(JwtAuthGuard)
    async recoverCv(@Param('id', ParseIntPipe) id: number, @User() user) {
        return this.cvService.restoreCv(id, user);
    }

    @Get('stats')
    async statsCvNumberByAge() {
        return await this.cvService.statCvNumberByAge(46, 32);
    }

    /*  
    L'ordre des routes a son importance, comme dans n'importe quel framework. 
    Il faut mettre les routes les plus génériques en dernier. Si on ne le fait pas,
    cela peut créer un conflit avec d'autres routes.

    Par exemple, cette route ci entre en conflit avec la route cv/stats car elle prend
    un argument générique :id. 

    Si elle est en premiere et que l'on souhaite appeler cv/stats on aura forcément 
    une erreur car cette route attend un nombre, et nous lui donnons un string.
    */
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getCvByID(@Param('id', ParseIntPipe) id: number, @User() user) {
        return await this.cvService.getCvByID(id, user);
    }
}
