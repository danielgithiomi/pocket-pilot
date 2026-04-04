import { Module } from '@nestjs/common';
import { GoalsService } from './services/goals.service';
import { IdentityModule } from '../identity/identity.module';
import { GoalsController } from './controllers/goals.controller';
import { GoalsRepository } from './repositories/goals.repository';

@Module({
    imports: [IdentityModule],
    controllers: [GoalsController],
    providers: [GoalsService, GoalsRepository],
})
export class GoalsModule {}
