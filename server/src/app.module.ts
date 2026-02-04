import 'dotenv/config'
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import {InfrastructureModule} from "./infrastructure/infrastructure.module";

@Module({
  imports: [InfrastructureModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
