import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

export interface ServerEventPayload<T> {
    type: string;
    data: T;
}

export interface ServerEventConnectionOptions<T> {
    endpoint: string;
    eventTypes: string[];
    onEvent: (event: ServerEventPayload<T>) => void;
    onError?: (event: Event) => void;
}

@Injectable({
    providedIn: 'root'
})
export class ServerEventsService {
    private readonly baseUrl = environment.API_BASE_URL;

    connect<T>({ endpoint, eventTypes, onEvent, onError }: ServerEventConnectionOptions<T>): EventSource {
        const source = new EventSource(`${this.baseUrl}/${endpoint}`, { withCredentials: true });

        eventTypes.forEach(type => {
            source.addEventListener(type, event => {
                onEvent({
                    type,
                    data: this.parseEventData<T>((event as MessageEvent).data)
                });
            });
        });

        source.onerror = event => onError?.(event);
        return source;
    }

    private parseEventData<T>(rawData: string): T {
        try {
            return JSON.parse(rawData) as T;
        } catch {
            return rawData as T;
        }
    }
}
