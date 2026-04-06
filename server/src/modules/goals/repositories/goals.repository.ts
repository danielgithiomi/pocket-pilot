import { Injectable } from '@nestjs/common';
import { CreateGoalDto, GoalDto } from '../dto/goals.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class GoalsRepository {
    constructor(private readonly db: DatabaseService) {}

    createGoal(userId: string, payload: CreateGoalDto): Promise<GoalDto> {
        return this.db.goal.create({
            data: {
                userId,
                ...payload,
                status: 'ACTIVE',
            },
        });
    }
}
