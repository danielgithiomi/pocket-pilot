import { Injectable } from '@nestjs/common';
import { CreateGoalDto, GoalDto } from '../dto/goals.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class GoalsRepository {
    constructor(private readonly db: DatabaseService) {}

    getUserGoals(userId: string): Promise<GoalDto[]> {
        return this.db.goals.findMany({
            where: { userId },
        });
    }

    createGoal(userId: string, payload: CreateGoalDto): Promise<GoalDto> {
        return this.db.goals.create({
            data: {
                userId,
                ...payload,
                status: 'ACTIVE',
            },
        });
    }

    deleteGoalById(userId: string, goalId: string) {
        return this.db.goals.delete({
            where: { id: goalId, userId },
        });
    }
}
