import { Module } from '@nestjs/common';
import { FeaturesCache } from './cache/features.cache';
import { FeaturesService } from './services/features.service';
import { IdentityModule } from '@modules/identity/identity.module';
import { FeaturesController } from './controllers/features.controller';
import { FeaturesRepository } from './repositories/features.repository';

@Module({
    imports: [IdentityModule],
    controllers: [FeaturesController],
    providers: [FeaturesService, FeaturesRepository, FeaturesCache]
})
export class FeaturesModule {}
