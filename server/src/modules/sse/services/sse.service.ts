import { randomUUID } from 'crypto';
import { Injectable, MessageEvent } from '@nestjs/common';
import { finalize, merge, Observable, of, Subject } from 'rxjs';
import { SSE_EVENT_NAME, SSE_EVENT_VARIANT, type SSE_EVENT_VARIANT as SSE_EVENT_VARIANT_TYPE } from '../sse.types';

@Injectable()
export class SSEService {
    private readonly userStreams = new Map<string, Subject<MessageEvent>>();
    private readonly userStreamConnections = new Map<string, number>();

    streamForUser(userId: string): Observable<MessageEvent> {
        const stream = this.getOrCreateUserStream(userId);
        this.userStreamConnections.set(userId, (this.userStreamConnections.get(userId) ?? 0) + 1);

        // Send the first event immediately so the client can confirm the channel is alive.
        const connectedEvent = of(this.createEvent(SSE_EVENT_VARIANT.CONNECTED, { connectedAt: new Date().toISOString() }));

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

    emitToUser<T extends string | object>(userId: string, type: SSE_EVENT_VARIANT_TYPE, data: T): void {
        this.userStreams.get(userId)?.next(this.createEvent(type, data));
    }

    private getOrCreateUserStream(userId: string): Subject<MessageEvent> {
        const existingStream = this.userStreams.get(userId);
        if (existingStream) return existingStream;

        const stream = new Subject<MessageEvent>();
        this.userStreams.set(userId, stream);
        return stream;
    }

    private createEvent<T extends string | object>(type: SSE_EVENT_VARIANT_TYPE, data: T): MessageEvent {
        return {
            data,
            retry: 5000,
            id: randomUUID(),
            type: SSE_EVENT_NAME[type]
        };
    }
}
