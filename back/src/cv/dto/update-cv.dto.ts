import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class UpdateCvDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    firstname: string;

    @Type(() => Number)
    @IsNumber()
    @Min(15)
    @Max(65)
    @IsOptional()
    age: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    cin: number;

    @IsString()
    @IsOptional()
    job: string;

    @IsString()
    @IsOptional()
    path: string;
}
