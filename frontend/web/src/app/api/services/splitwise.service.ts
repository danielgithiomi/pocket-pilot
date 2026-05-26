import { inject, Injectable } from '@angular/core';
import { ApiServiceError } from './api-error.service';
import { SplitwiseMutation } from '@methods/mutations';
import { SplitwiseResource } from '@methods/resources';
import { catchError, EMPTY, map, Observable, of, tap } from 'rxjs';
import {
    IStandardError,
    SplitwiseSquad,
    IStandardResponse,
    SplitwiseSquadPayload,
    IVoidResourceResponse,
    SplitwiseEventPayload,
} from '@global/types';

@Injectable({
    providedIn: 'root',
})
export class SplitwiseService {
    private readonly mutation = inject(SplitwiseMutation);
    private readonly resource = inject(SplitwiseResource);
    private readonly errorService = inject(ApiServiceError);

    getOrderCategoryTags = () => this.resource.getOrderCategoryTags;

    // SQUAD
    getUserSquads = () => this.resource.getUserSplitwiseSquads;

    getSquadById(squadId: string): Observable<SplitwiseSquad> {
        const resourceValue = this.getUserSquads().value();

        if (!resourceValue) {
            this.errorService.renderToast({
                type: 'error',
                statusCode: 404,
                title: 'Error fetching your squad!',
                details: `Failed to load the squad resource in time.`,
            });
            return EMPTY;
        }

        const squad = resourceValue.data.find((squad) => squad.id === squadId);

        if (!squad) {
            this.errorService.renderToast({
                type: 'error',
                statusCode: 404,
                title: 'Squad not found!',
                details: `No squad was found for this user. Please refresh the page.`,
            });
            return EMPTY;
        }

        return of(squad);
    }

    createNewUserSquad(payload: SplitwiseSquadPayload): Observable<SplitwiseSquad> {
        return this.mutation.createNewSquad(payload).pipe(
            map((response: IStandardResponse<SplitwiseSquad>) => response.data),
            catchError((error: IStandardError) => {
                this.errorService.renderToast(error);
                return EMPTY;
            }),
        );
    }

    updateExistingUserSquad(
        squadId: string,
        payload: SplitwiseSquadPayload,
    ): Observable<SplitwiseSquad> {
        return this.mutation.updateExistingUserSquad(squadId, payload).pipe(
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

    // SPLITTABLES
    getUserSplitrEvents = () => this.resource.getUserSplitrEvents;

    createNewSplitwiseEvent(payload: SplitwiseEventPayload) {
        return this.mutation.createNewSplitwiseEvent(payload).pipe(
            // map((response: IStandardResponse<SplitwiseEventPayload>) => response.data),
            tap((response: IStandardResponse<SplitwiseEventPayload>) => {
                console.log('Splitwise event created successfully', response);
            }),
            catchError((error: IStandardError) => {
                this.errorService.renderToast(error);
                return EMPTY;
            }),
        );
    }
}
