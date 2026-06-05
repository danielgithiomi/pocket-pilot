import { Module } from '@nestjs/common';
import { SquadsService } from './services/squads.service';
import { SplitrService } from './services/splitr.service';
import { SquadsCache, SplitrCache } from './caches/splitr.cache';
import { IdentityModule } from '@modules/identity/identity.module';
import { SquadsController } from './controllers/squads.controller';
import { SplitrController } from './controllers/splitr.controller';
import { SquadsRepository } from './repositories/squads.repository';
import { SplitrRepository } from './repositories/splitr.repository';

@Module({
    imports: [IdentityModule],
    controllers: [SquadsController, SplitrController],
    providers: [SplitrService, SquadsService, SquadsCache, SplitrCache, SplitrRepository, SquadsRepository],
})
export class SplitrModule {}
