import { ToastService } from '@atoms/toast';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { NotificationsMutation } from '@methods/mutations';
import { NotificationsResource } from '@methods/resources';
import {
    AppNotification,
    IStandardError,
    IVoidResourceResponse,
    NotificationActionResult,
    NotificationEventPayload,
    SSE_EVENT_NAME as SSE_EVENT
} from '@global/types';
import { ServerEventsService } from './server-events.service';
import { API_ENDPOINTS as endpoints } from '@global/constants';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    private readonly toastService = inject(ToastService);
    private readonly mutation = inject(NotificationsMutation);
    private readonly resource = inject(NotificationsResource);
    private readonly serverEvents = inject(ServerEventsService);

    getUserNotifications = () => this.resource.userNotifications;

    getNotificationSummary = () => this.resource.notificationSummary;

    markAsRead(notificationId: string): Observable<AppNotification> {
        return this.mutation.markAsRead(notificationId).pipe(
            map(response => response.data),
            catchError((error: IStandardError) => this.handleError<AppNotification>(error))
        );
    }

    archive(notificationId: string): Observable<AppNotification> {
        return this.mutation.archive(notificationId).pipe(
            map(response => response.data),
            catchError((error: IStandardError) => this.handleError<AppNotification>(error))
        );
    }

    markAllAsRead(): Observable<IVoidResourceResponse> {
        return this.mutation.markAllAsRead().pipe(
            map(response => response.data),
            catchError((error: IStandardError) => this.handleError<IVoidResourceResponse>(error))
        );
    }

    executeAction(notificationId: string, actionId: string): Observable<NotificationActionResult> {
        return this.mutation.executeAction(notificationId, actionId).pipe(
            map(response => response.data),
            catchError((error: IStandardError) => this.handleError<NotificationActionResult>(error))
        );
    }

    connectToEvents(
        onEvent: (payload: NotificationEventPayload) => void,
        onError?: (event: Event) => void
    ): EventSource {
        return this.serverEvents.connect<NotificationEventPayload>({
            onError,
            endpoint: endpoints.sse,
            onEvent: event => onEvent(event.data),
            eventTypes: [SSE_EVENT.NOTIFICATION_CREATED, SSE_EVENT.NOTIFICATION_UPDATED, SSE_EVENT.NOTIFICATION_DELETED]
        });
    }

    private handleError<T>(error: IStandardError): Observable<T> {
        this.toastService.show({
            title: error.title,
            variant: 'error',
            details: error.details as string
        });
        return EMPTY;
    }
}
