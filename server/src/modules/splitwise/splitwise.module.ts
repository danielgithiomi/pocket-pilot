import { Module } from '@nestjs/common';
import { SplitwiseService } from './splitwise.service';
import { SplitwiseController } from './splitwise.controller';
import { IdentityModule } from '@modules/identity/identity.module';

@Module({
    imports: [IdentityModule],
    providers: [SplitwiseService],
    controllers: [SplitwiseController],
})
export class SplitwiseModule {}
