import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import {DatabaseModule} from "../infrastructure/database/database.module";

@Module({
  controllers: [],
  providers: [],
  imports: [DatabaseModule, AccountsModule],
})
export class AppModules {}
