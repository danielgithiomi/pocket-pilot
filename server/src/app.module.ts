import 'dotenv/config'
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import {InfrastructureModule} from "./infrastructure/infrastructure.module";
import { AppModules } from './modules/modules.module';

@Module({
  imports: [InfrastructureModule, AppModules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
