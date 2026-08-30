import { Global, Module } from '@nestjs/common';
import { SSEService } from './services/sse.service';
import { SSEController } from './controllers/sse.controller';
import { IdentityModule } from '@modules/identity/identity.module';

@Global()
@Module({
    exports: [SSEService],
    providers: [SSEService],
    imports: [IdentityModule],
    controllers: [SSEController]
})
export class SSEModule {}
