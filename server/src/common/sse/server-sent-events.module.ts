import { Global, Module } from '@nestjs/common';
import { ServerSentEventsService } from './server-sent-events.service';

@Global()
@Module({
    exports: [ServerSentEventsService],
    providers: [ServerSentEventsService]
})
export class ServerSentEventsModule {}
