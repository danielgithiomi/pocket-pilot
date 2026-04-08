import { ToastService } from '@atoms/toast';
import { inject, Injectable } from '@angular/core';
import { GoalsResource } from '@methods/resources';
import { GoalsMutation } from '@methods/mutations';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { CreateGoalRequest, Goal, IStandardError, IStandardResponse } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  private readonly resource = inject(GoalsResource);
  private readonly mutation = inject(GoalsMutation);
  private readonly toastService = inject(ToastService);

  getGoalCategories = () => this.resource.getGoalCategories;

  createNewGoal(payload: CreateGoalRequest): Observable<Goal> {
    return this.mutation.createNewGoal(payload).pipe(
      map((response: IStandardResponse<Goal>) => response.data),
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
