import { Injectable } from '@angular/core';
import { SSE_EVENT_NAME } from '@global/types';
import { environment } from '@environments/environment';
import { API_ENDPOINTS as endpoints } from '@global/constants';

export interface ServerEventPayload<T> {
    data: T;
    type: SSE_EVENT_NAME;
}

export interface SSEConnectionOptions<T> {
    sseUrl: string;
    eventTypes: SSE_EVENT_NAME[];
    onError?: (event: Event) => void;
    onEvent: (event: ServerEventPayload<T>) => void;
}

@Injectable({
    providedIn: 'root'
})
export class SSEService {
    private readonly baseUrl = environment.API_BASE_URL;

    configureSSEConnection<T>(
        eventTypes: SSE_EVENT_NAME[],
        onEvent: (event: T) => void,
        onError?: (event: Event) => void,
        endpoint: string = endpoints.sse
    ): EventSource {
        const sseUrl: string = `${this.baseUrl}/${endpoint}`;

        return this.connect<T>({
            sseUrl,
            onError,
            eventTypes,
            onEvent: (event: ServerEventPayload<T>): void => onEvent(event.data)
        });
    }

    private connect<T>({ sseUrl, eventTypes, onEvent, onError }: SSEConnectionOptions<T>): EventSource {
        const source = new EventSource(sseUrl, { withCredentials: true });

        source.onopen = () => console.log('SSE connection established');
        source.onmessage = (event) => console.log('SSE message received:', event);

        eventTypes.forEach((type) => {
            source.addEventListener(type, (event) => {
                onEvent({
                    type,
                    data: this.parseEventData<T>((event as MessageEvent).data)
                });
            });
        });

        source.onerror = (event) => onError?.(event);
        return source;
    }

    // HELPER METHODS
    private parseEventData<T>(rawData: string): T {
        try {
            return JSON.parse(rawData) as T;
        } catch {
            return rawData as T;
        }
    }
}
