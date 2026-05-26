import { Module } from '@nestjs/common';
import { SquadsCache } from './caches/squads.cache';
import { SquadsService } from './services/squads.service';
import { SplitwiseCache } from './caches/splitwise.cache';
import { SplitwiseService } from './services/splitwise.service';
import { IdentityModule } from '@modules/identity/identity.module';
import { SquadsController } from './controllers/squads.controller';
import { SquadsRepository } from './repositories/squads.repository';
import { SplitwiseController } from './controllers/splitwise.controller';
import { SplitwiseRepository } from './repositories/splitwise.repository';

@Module({
    imports: [IdentityModule],
    controllers: [SquadsController, SplitwiseController],
    providers: [SplitwiseService, SquadsService, SquadsCache, SplitwiseCache, SplitwiseRepository, SquadsRepository],
})
export class SplitwiseModule {}
