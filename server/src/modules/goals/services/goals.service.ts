import { Injectable } from '@nestjs/common';
import { GoalsRepository } from '../repositories/goals.repository';

@Injectable()
export class GoalsService {
    constructor(private readonly goalsRepository: GoalsRepository) {}

    createGoal() {
        return this.goalsRepository.createGoal();
    }
}
