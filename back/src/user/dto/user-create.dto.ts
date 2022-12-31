import { IsEmail, IsNotEmpty } from 'class-validator';

export class userCreateDto {
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}
