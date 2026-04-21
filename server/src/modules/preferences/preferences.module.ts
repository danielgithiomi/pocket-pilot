import { Module } from '@nestjs/common';
import { IdentityModule } from '@modules/identity/identity.module';
import { PreferencesService } from './services/preferences.service';
import { PreferencesController } from './controllers/preferences.controller';

@Module({
    imports: [IdentityModule],
    providers: [PreferencesService],
    controllers: [PreferencesController],
})
export class PreferencesModule {}
