import 'dotenv/config.js';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const CORS_CONFIG: CorsOptions = {
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    origin: [process.env.CLIENT_URL!],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: CORS_CONFIG });

    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
    .then(() =>
        console.log(`Application bootstrapped successfully! \nAccess URL: http://localhost:${process.env.PORT}`),
    )
    .catch(err => console.error(`Application failed to bootstrap: ${err}`));
