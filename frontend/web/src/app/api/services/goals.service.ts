import { ToastService } from '@atoms/toast';
import { inject, Injectable } from '@angular/core';
import { GoalsResource } from '@methods/resources';
import { GoalsMutation } from '@methods/mutations';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import {
  Goal,
  IStandardError,
  IGlobalResponse,
  CreateGoalRequest,
  IVoidResourceResponse,
} from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  private readonly resource = inject(GoalsResource);
  private readonly mutation = inject(GoalsMutation);
  private readonly toastService = inject(ToastService);

  getUserGoals = () => this.resource.getUserGoals;

  getGoalCategories = () => this.resource.getGoalCategories;

  createNewGoal(payload: CreateGoalRequest): Observable<Goal> {
    return this.mutation.createNewGoal(payload).pipe(
      map((response: IGlobalResponse<Goal>) => response.body),
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  }

  deleteGoalById(goalId: string): Observable<IVoidResourceResponse> {
    return this.mutation.deleteGoalById(goalId).pipe(
      map((response: IGlobalResponse<IVoidResourceResponse>) => response.body),
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  }

  // HELPER FUNCTIONS
  private renderToast = (error: IStandardError) => {
    const { title, details } = error;
    this.toastService.show({
      title,
      details: details as string,
      variant: 'error',
    });
  };
}
