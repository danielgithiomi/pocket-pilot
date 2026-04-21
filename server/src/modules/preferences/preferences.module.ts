import { Module } from '@nestjs/common';
import { OnboardingService } from './services/onboarding.service';
import { IdentityModule } from '@modules/identity/identity.module';
import { PreferencesService } from './services/preferences.service';
import { OnboardingController } from './controllers/onboarding.controller';
import { OnboardingRepository } from './repositories/onboarding.repository';
import { PreferencesController } from './controllers/preferences.controller';
import { PreferencesRepository } from './repositories/preferences.repository';

@Module({
    imports: [IdentityModule],
    controllers: [PreferencesController, OnboardingController],
    providers: [PreferencesService, OnboardingService, OnboardingRepository, PreferencesRepository],
})
export class PreferencesModule {}
