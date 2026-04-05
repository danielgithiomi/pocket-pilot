import { Injectable } from '@nestjs/common';
import { CreateGoalDto, GoalDto } from '../dto/goals.dto';
import { GoalsRepository } from '../repositories/goals.repository';

@Injectable()
export class GoalsService {
    constructor(private readonly goalsRepository: GoalsRepository) {}

    createGoal(userId: string, payload: CreateGoalDto): Promise<GoalDto> {
        return this.goalsRepository.createGoal(userId, payload);
    }
}
