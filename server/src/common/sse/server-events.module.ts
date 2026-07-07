import { Global, Module } from '@nestjs/common';
import { ServerEventsService } from './server-events.service';

@Global()
@Module({
    exports: [ServerEventsService],
    providers: [ServerEventsService]
})
export class ServerEventsModule {}
