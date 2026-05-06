import { Module } from '@nestjs/common';
import { SquadsCache } from './caches/squads.cache';
import { SplitwiseService } from './splitwise.service';
import { SplitwiseController } from './splitwise.controller';
import { IdentityModule } from '@modules/identity/identity.module';
import { SplitwiseRepository } from './repositories/splitwise.repository';

@Module({
    imports: [IdentityModule],
    controllers: [SplitwiseController],
    providers: [SplitwiseService, SquadsCache, SplitwiseRepository],
})
export class SplitwiseModule {}
