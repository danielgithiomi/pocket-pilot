import { randomUUID } from 'crypto';
import { Injectable, MessageEvent } from '@nestjs/common';
import { finalize, merge, Observable, of, Subject } from 'rxjs';

export type ServerEventName =
    | 'connected'
    | 'wallet.updated'
    | 'account.updated'
    | 'notification.created'
    | 'notification.updated'
    | 'notifications.refreshed';

@Injectable()
export class ServerEventsService {
    private readonly userStreams = new Map<string, Subject<MessageEvent>>();
    private readonly userStreamConnections = new Map<string, number>();

    streamForUser(userId: string): Observable<MessageEvent> {
        const stream = this.getOrCreateUserStream(userId);
        this.userStreamConnections.set(userId, (this.userStreamConnections.get(userId) ?? 0) + 1);

        // Send the first event immediately so the client can confirm the channel is alive.
        const connectedEvent = of(this.createEvent('connected', { connectedAt: new Date().toISOString() }));

        return merge(connectedEvent, stream.asObservable()).pipe(
            finalize(() => {
                // Drop the in-memory stream when the last tab/client disconnects.
                const nextConnectionCount = (this.userStreamConnections.get(userId) ?? 1) - 1;
                if (nextConnectionCount > 0) {
                    this.userStreamConnections.set(userId, nextConnectionCount);
                    return;
                }

                this.userStreamConnections.delete(userId);
                this.userStreams.delete(userId);
            })
        );
    }

    emitToUser<T extends string | object>(userId: string, type: ServerEventName, data: T): void {
        this.userStreams.get(userId)?.next(this.createEvent(type, data));
    }

    private getOrCreateUserStream(userId: string): Subject<MessageEvent> {
        const existingStream = this.userStreams.get(userId);
        if (existingStream) return existingStream;

        const stream = new Subject<MessageEvent>();
        this.userStreams.set(userId, stream);
        return stream;
    }

    private createEvent<T extends string | object>(type: ServerEventName, data: T): MessageEvent {
        return {
            type,
            data,
            retry: 5000,
            id: randomUUID()
        };
    }
}
