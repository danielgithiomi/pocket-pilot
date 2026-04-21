import { Module } from '@nestjs/common';
import { PreferencesService } from './services/preferences.service';
import { PreferencesController } from './controllers/preferences.controller';

@Module({
    providers: [PreferencesService],
    controllers: [PreferencesController],
})
export class PreferencesModule {}
