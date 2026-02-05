import 'dotenv/config';
import {Module} from '@nestjs/common';
import {AppService} from './app.service';
import {AppController} from './app.controller';
import {AppModules} from './modules/modules.module';
import {InfrastructureModule} from '@infrastructure/infrastructure.module';

@Module({
  providers: [AppService],
  controllers: [AppController],
  imports: [InfrastructureModule, AppModules],
})
export class AppModule {}
