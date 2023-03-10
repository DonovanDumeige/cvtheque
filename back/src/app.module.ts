import { HelmetMiddleware } from '@nest-middleware-collection/helmet';
import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirstMiddleware, logger } from './middleware';
import { TodoModule } from './todo/todo.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvModule } from './cv/cv.module';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';

dotenv.config();
@Module({
    imports: [
        TodoModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: ['dist/**/*.entity{.ts,.js}'],
            synchronize: true,
        }),
        CvModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(FirstMiddleware)
            .forRoutes(
                'hello',
                { path: 'todo', method: RequestMethod.GET },
                // pour comprendre les routes de 'todo' qui ont un placeholder,
                // il faut ajouter * qui remplace ce placeholder
                { path: 'todo*', method: RequestMethod.DELETE },
            )
            .apply(logger)
            .forRoutes('')
            .apply(HelmetMiddleware)
            .forRoutes('');
    }
}
