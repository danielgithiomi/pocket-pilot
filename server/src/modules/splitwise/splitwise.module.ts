import { Module } from '@nestjs/common';
import { SquadsCache } from './caches/squads.cache';
import { SplitwiseService } from './services/splitwise.service';
import { IdentityModule } from '@modules/identity/identity.module';
import { SquadsController } from './controllers/squads.controller';
import { SplitwiseController } from './controllers/splitwise.controller';
import { SplitwiseRepository } from './repositories/splitwise.repository';

@Module({
    imports: [IdentityModule],
    controllers: [SplitwiseController, SquadsController],
    providers: [SplitwiseService, SquadsCache, SplitwiseRepository],
})
export class SplitwiseModule {}
