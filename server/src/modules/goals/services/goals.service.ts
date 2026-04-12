import { Injectable } from '@nestjs/common';
import { GoalCategory } from '@prisma/client';
import { ExposeEnumDto } from '@common/types';
import { formatEnumForFrontend } from '@libs/utils';
import { CreateGoalDto, GoalDto } from '../dto/goals.dto';
import { GoalsRepository } from '../repositories/goals.repository';

@Injectable()
export class GoalsService {
    constructor(private readonly goalsRepository: GoalsRepository) {}

    async getGoalCategories(): Promise<ExposeEnumDto[]> {
        return await Promise.resolve(Object.values(GoalCategory).map(formatEnumForFrontend));
    }

    getUserGoals(userId: string): Promise<GoalDto[]> {
        return this.goalsRepository.getUserGoals(userId);
    }

    createGoal(userId: string, payload: CreateGoalDto): Promise<GoalDto> {
        return this.goalsRepository.createGoal(userId, payload);
    }

    deleteGoalById(userId: string, goalId: string) {
        return this.goalsRepository.deleteGoalById(userId, goalId);
    }
}
