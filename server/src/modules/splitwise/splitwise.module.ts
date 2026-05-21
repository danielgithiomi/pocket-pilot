import { Module } from '@nestjs/common';
import { SquadsCache } from './caches/squads.cache';
import { SplitwiseService } from './services/splitwise.service';
import { IdentityModule } from '@modules/identity/identity.module';
import { SplitwiseController } from './controllers/splitwise.controller';
import { SplitwiseRepository } from './repositories/splitwise.repository';

@Module({
    imports: [IdentityModule],
    controllers: [SplitwiseController],
    providers: [SplitwiseService, SquadsCache, SplitwiseRepository],
})
export class SplitwiseModule {}
