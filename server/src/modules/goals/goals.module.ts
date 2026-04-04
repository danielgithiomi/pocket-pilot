import { Module } from '@nestjs/common';
import { GoalsService } from './services/goals.service';
import { GoalsController } from './controllers/goals.controller';
import { GoalsRepository } from './repositories/goals.repository';

@Module({
  controllers: [GoalsController],
  providers: [GoalsService, GoalsRepository],
})
export class GoalsModule {}
