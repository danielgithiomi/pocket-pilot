import { Observable } from 'rxjs';
import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { CreateGoalRequest, Goal, IGlobalResponse, IVoidResourceResponse } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class GoalsMutation {
  private readonly client = inject(ApiClient);

  createNewGoal(payload: CreateGoalRequest): Observable<IGlobalResponse<Goal>> {
    return this.client.post<Goal, CreateGoalRequest>(endpoints.goals, payload);
  }

  deleteGoalById(goalId: string): Observable<IGlobalResponse<IVoidResourceResponse>> {
    const url = `${endpoints.goals}/${goalId}`;
    return this.client.delete<IVoidResourceResponse>(url);
  }
}
