import { Prisma } from '@prisma/client';
import { CreateGoalDto, GoalDto } from '../dto/goals.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
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

    async deleteGoalById(goalId: string) {
        return this.db.goals.delete({ where: { id: goalId } }).catch(error => {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')
                throw new NotFoundException({
                    name: 'GOAL_DELETE_FAILED',
                    title: 'Goal Delete Failed!',
                    details: 'The goal you are trying to delete does not exist in the database.',
                });

            throw error;
        });
    }
}
