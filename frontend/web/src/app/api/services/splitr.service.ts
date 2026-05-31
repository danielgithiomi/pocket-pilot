import { inject, Injectable } from '@angular/core';
import { SplitrMutation } from '@methods/mutations';
import { SplitrResource } from '@methods/resources';
import { ApiServiceError } from './api-error.service';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import {
    SplitrSquad,
    ISplitrEvent,
    IStandardError,
    IStandardResponse,
    SplitrSquadPayload,
    SplitrEventPayload,
    SettleSplitrPayload,
    IVoidResourceResponse,
} from '@global/types';

@Injectable({
    providedIn: 'root',
})
export class SplitrService {
    private readonly mutation = inject(SplitrMutation);
    private readonly resource = inject(SplitrResource);
    private readonly errorService = inject(ApiServiceError);

    getOrderCategoryTags = () => this.resource.getOrderCategoryTags;

    // SQUAD
    getUserSquads = () => this.resource.getUserSplitrSquads;

    getSquadById(squadId: string): Observable<SplitrSquad> {
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

    createNewUserSquad(payload: SplitrSquadPayload): Observable<SplitrSquad> {
        return this.mutation.createNewSquad(payload).pipe(
            map((response: IStandardResponse<SplitrSquad>) => response.data),
            catchError((error: IStandardError) => {
                this.errorService.renderToast(error);
                return EMPTY;
            }),
        );
    }

    updateExistingUserSquad(squadId: string, payload: SplitrSquadPayload): Observable<SplitrSquad> {
        return this.mutation.updateExistingUserSquad(squadId, payload).pipe(
            map((response: IStandardResponse<SplitrSquad>) => response.data),
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

    getUserSplitrEventById = (eventId: string) => this.resource.getSplitrEventById(eventId);

    createNewSplitrEvent(payload: SplitrEventPayload): Observable<ISplitrEvent> {
        return this.mutation.createNewSplitrEvent(payload).pipe(
            map((response: IStandardResponse<ISplitrEvent>) => response.data),
            catchError((error: IStandardError) => {
                this.errorService.renderToast(error);
                return EMPTY;
            }),
        );
    }

    markSplitrEventAsSettledOrPending(
        eventId: string,
        payload: SettleSplitrPayload,
    ): Observable<IVoidResourceResponse> {
        return this.mutation.markSplitrEventAsSettledOrPending(eventId, payload).pipe(
            map((response: IStandardResponse<IVoidResourceResponse>) => response.data),
            catchError((error: IStandardError) => {
                this.errorService.renderToast(error);
                return EMPTY;
            }),
        );
    }

    deleteExistingSplitrEvent(eventId: string): Observable<IVoidResourceResponse> {
        return this.mutation.deleteExistingSplitrEvent(eventId).pipe(
            map((response: IStandardResponse<IVoidResourceResponse>) => response.data),
            catchError((error: IStandardError) => {
                this.errorService.renderToast(error);
                return EMPTY;
            }),
        );
    }
}
