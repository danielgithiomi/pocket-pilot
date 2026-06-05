import { Module } from '@nestjs/common';
import { IdentityModule } from '@modules/identity/identity.module';
import { FeaturesController } from './controllers/features.controller';

@Module({
    imports: [IdentityModule],
    controllers: [FeaturesController],
    // providers: [FeaturesCache, FeaturesService, FeaturesRepository],
})
export class FeaturesModule {}
