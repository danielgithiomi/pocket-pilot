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
} from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class SplitwiseService {
  private readonly mutation = inject(SplitwiseMutation);
  private readonly resource = inject(SplitwiseResource);
  private readonly errorService = inject(ApiServiceError);

  createNewUserSquad(payload: SplitwiseSquadPayload): Observable<SplitwiseSquad> {
    return this.mutation.createNewSquad(payload).pipe(
      map((response: IStandardResponse<SplitwiseSquad>) => response.data),
      catchError((error: IStandardError) => {
        this.errorService.renderToast(error);
        return EMPTY;
      }),
    );
  }

  getUserSquads() {
    return this.resource.getUserSplitwiseSquads;
  }
}
