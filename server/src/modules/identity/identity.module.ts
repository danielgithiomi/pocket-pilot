import {Module} from '@nestjs/common';
import {IdentityService} from './services/identity.service';
import {IdentityController} from './controllers/identity.controller';

@Module({
    providers: [IdentityService],
    controllers: [IdentityController],
})
export class IdentityModule {}
