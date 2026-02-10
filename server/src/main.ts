import 'dotenv/config.js';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const CORS_CONFIG: CorsOptions = {
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    origin: [process.env.CLIENT_URL!],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

const LOGGER_CONFIG = new ConsoleLogger({
    json: false,
    colors: true,
    timestamp: true,
    prefix: 'Pocket-Pilot',
});

const SWAGGER_CONFIG = new DocumentBuilder()
    .setTitle('Pocket Pilot API')
    .setDescription('Pocket Pilot API Documentation')
    .setVersion('1.0.0')
    .addTag('Pocket Pilot')
    .build();

const logger = new Logger('APP-ROOT');

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: CORS_CONFIG, logger: LOGGER_CONFIG });

    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');

    // Swagger Documentation
    const document = SwaggerModule.createDocument(app, SWAGGER_CONFIG);
    SwaggerModule.setup('api/v1/docs', app, document);

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
    .then(() => {
        logger.log(`🚀 Access URL: http://localhost:${process.env.PORT}/api/v1`);
        logger.log(`📚 API Documentation: http://localhost:${process.env.PORT}/api/v1/docs`);
        logger.log(`🚀 Application bootstrapped successfully!`);
    })
    .catch(err => logger.error(`❌ Application failed to bootstrap: ${err}`));
