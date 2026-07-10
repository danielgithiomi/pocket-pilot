import { randomUUID } from 'crypto';
import { map } from 'rxjs/operators';
import { PPConfigService } from '@infrastructure/config';
import { Injectable, MessageEvent } from '@nestjs/common';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { finalize, interval, merge, Observable, of, Subject } from 'rxjs';
import { SSE_EVENT_NAME, SSE_EVENT_VARIANT, type SSE_EVENT_VARIANT as SSE_EVENT_VARIANT_TYPE } from '../sse.types';

@Injectable()
export class SSEService {
    constructor(private readonly configService: PPConfigService) {}

    private readonly userStreams = new Map<string, Subject<MessageEvent>>();
    private readonly userStreamConnections = new Map<string, number>();

    streamForUser({ id: userId, name: username }: User): Observable<MessageEvent> {
        const stream = this.getOrCreateUserStream(userId);
        this.userStreamConnections.set(userId, (this.userStreamConnections.get(userId) ?? 0) + 1);

        // Send the first event immediately so the client can confirm the channel is alive.
        const connectedEvent = this.createConnectionEvent(userId, username);

        // Send 'alive-checks' every 30 seconds so that the client can keep the connection open
        const heartbeatEvent = this.createHeartbeatEvent(userId, username);

        return merge(connectedEvent, heartbeatEvent, stream.asObservable()).pipe(
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

    private createConnectionEvent(userId: string, username: string): Observable<MessageEvent> {
        return of(
            this.createEvent(SSE_EVENT_VARIANT.CONNECTED, {
                connectedUser: { username, userId },
                connectedAt: new Date().toISOString()
            })
        );
    }

    private createHeartbeatEvent(userId: string, username: string): Observable<MessageEvent> {
        return interval(this.convertToMs(this.configService.sse.heartBeatIntervalMinutes)).pipe(
            map(() => {
                return this.createEvent(SSE_EVENT_VARIANT.HEARTBEAT, {
                    type: SSE_EVENT_VARIANT.HEARTBEAT,
                    connectedUser: { username, userId },
                    datetime: new Date(Date.now()).toISOString()
                });
            })
        );
    }

    private convertToMs(minutes: number): number {
        return minutes * 60 * 1000;
    }
}
