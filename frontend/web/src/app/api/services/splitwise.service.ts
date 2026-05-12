import { inject, Injectable } from '@angular/core';
import { ApiServiceError } from './api-error.service';
import { SplitwiseMutation } from '@methods/mutations';
import { SplitwiseResource } from '@methods/resources';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import {
  IStandardError,
  SplitwiseSquad,
  IStandardResponse,
  SplitwiseSquadPayload,
  IVoidResourceResponse,
} from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class SplitwiseService {
  private readonly mutation = inject(SplitwiseMutation);
  private readonly resource = inject(SplitwiseResource);
  private readonly errorService = inject(ApiServiceError);

  getUserSquads = () => this.resource.getUserSplitwiseSquads;

  getOrderCategoryTags = () => this.resource.getOrderCategoryTags;

  createNewUserSquad(payload: SplitwiseSquadPayload): Observable<SplitwiseSquad> {
    return this.mutation.createNewSquad(payload).pipe(
      map((response: IStandardResponse<SplitwiseSquad>) => response.data),
      catchError((error: IStandardError) => {
        this.errorService.renderToast(error);
        return EMPTY;
      }),
    );
  }

  deleteExistingUserSquad(squadId: string): Observable<IVoidResourceResponse> {
    return this.mutation.deleteExistingUserSquad(squadId).pipe(
      map((response: IStandardResponse<IVoidResourceResponse>) => response.data),
      catchError((error: IStandardError) => {
        this.errorService.renderToast(error);
        return EMPTY;
      }),
    );
  }
}
