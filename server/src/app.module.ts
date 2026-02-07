import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { APP_MODULE_IMPORTS, APP_MODULE_PROVIDERS } from './app.constants';

@Module({
  controllers: [AppController],
  imports: [...APP_MODULE_IMPORTS],
  providers: [...APP_MODULE_PROVIDERS],
})
export class AppModule {}
