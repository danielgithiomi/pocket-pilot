import { Injectable } from '@nestjs/common';
import { ExposeEnumDto } from '@common/types';
import { GoalCategory } from '@prisma/client';
import { formatEnumForFrontend } from '@libs/utils';
import { CreateGoalDto, GoalDto } from '../dto/goals.dto';
import { GoalsRepository } from '../repositories/goals.repository';

@Injectable()
export class GoalsService {
    constructor(private readonly goalsRepository: GoalsRepository) {}

    async getGoalCategories(): Promise<ExposeEnumDto[]> {
        return await Promise.resolve(Object.values(GoalCategory).map(formatEnumForFrontend));
    }

    createGoal(userId: string, payload: CreateGoalDto): Promise<GoalDto> {
        return this.goalsRepository.createGoal(userId, payload);
    }
}
