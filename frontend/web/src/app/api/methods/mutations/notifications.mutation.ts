import { Observable } from 'rxjs';
import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { AppNotification, IStandardResponse, IVoidResourceResponse, NotificationActionResult } from '@global/types';

@Injectable({
    providedIn: 'root'
})
export class NotificationsMutation {
    private readonly client = inject(ApiClient);

    markAsRead(notificationId: string): Observable<IStandardResponse<AppNotification>> {
        return this.client.patch<AppNotification, Record<string, never>>(
            `${endpoints.notifications}/${notificationId}/read`,
            {}
        );
    }

    archive(notificationId: string): Observable<IStandardResponse<AppNotification>> {
        return this.client.patch<AppNotification, Record<string, never>>(
            `${endpoints.notifications}/${notificationId}/archive`,
            {}
        );
    }

    markAllAsRead(): Observable<IStandardResponse<IVoidResourceResponse>> {
        return this.client.patch<IVoidResourceResponse, Record<string, never>>(
            endpoints.notifications_mark_all_read,
            {}
        );
    }

    executeAction(notificationId: string, actionId: string): Observable<IStandardResponse<NotificationActionResult>> {
        return this.client.post<NotificationActionResult, Record<string, never>>(
            `${endpoints.notifications}/${notificationId}/actions/${actionId}`,
            {}
        );
    }
}
