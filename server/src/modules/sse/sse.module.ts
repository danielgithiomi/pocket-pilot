import { Global, Module } from '@nestjs/common';
import { SSEService } from './services/sse.service';
import { SSEController } from './controllers/sse.controller';

@Global()
@Module({
    exports: [SSEService],
    providers: [SSEService],
    controllers: [SSEController]
})
export class SSEModule {}
