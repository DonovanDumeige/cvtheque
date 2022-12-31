import { Body, Controller, Post } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { loginDto } from './dto/login.dto';
import { userCreateDto } from './dto/user-create.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    @Post()
    signin(@Body() dto: userCreateDto): Promise<Partial<UserEntity>> {
        return this.userService.signin(dto);
    }

    @Post('login')
    login(@Body() dto: loginDto) {
        return this.userService.login(dto);
    }
}
