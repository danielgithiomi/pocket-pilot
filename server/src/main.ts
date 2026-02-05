import 'dotenv/config.js';
import {AppModule} from './app.module';
import {NestFactory} from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
    .then(() =>
        console.log(
            `Application bootstrapped successfully! \nAccess URL: http://localhost:${process.env.PORT}`,
        ),
    )
    .catch((err) => console.error(`Application failed to bootstrap: ${err}`));
