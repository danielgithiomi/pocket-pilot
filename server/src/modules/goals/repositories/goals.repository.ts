import { Injectable } from '@nestjs/common';

@Injectable()
export class GoalsRepository {
    createGoal() {
        return 'This action adds a new goal';
    }
}
