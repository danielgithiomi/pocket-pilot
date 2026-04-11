import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { CreateGoalRequest, Goal } from '@global/types';
import { API_ENDPOINTS as endpoints } from '@global/constants';

@Injectable({
  providedIn: 'root',
})
export class GoalsMutation {
  private readonly client = inject(ApiClient);

  createNewGoal(payload: CreateGoalRequest) {
    return this.client.post<Goal, CreateGoalRequest>(endpoints.goals, payload);
  }

  deleteBillById(billId: string) {
    const url = `${endpoints.goals}/${billId}`;
    return this.client.delete(url);
  }
}
