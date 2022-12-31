import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response } from 'express';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';
import { DurationInterceptor } from './interceptors/duration/duration.interceptor';
import { ConfigService } from '@nestjs/config';
dotenv.config();
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const corsOptions = {
        origin: ['http://localhost:4200'],
    };
    app.enableCors(corsOptions);
    app.use(morgan('dev'));
    app.use((req: Request, res: Response, next: () => void) => {
        console.log('Middleware from app.use');
        next();
    });
    app.useGlobalPipes(
        new ValidationPipe({
            // transforme des class en type (cf. /todo.controller/ getTodos)
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
    app.useGlobalInterceptors(new DurationInterceptor());
    await app.listen(configService.get('APP_PORT'));
}
bootstrap();
