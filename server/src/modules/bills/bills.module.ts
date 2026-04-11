import { Module } from '@nestjs/common';
import { BillsService } from './services/bills.service';
import { BillsController } from './controllers/bills.controller';
import { IdentityModule } from '@modules/identity/identity.module';
import { BillsRepository } from './repositories/bills.repositories';

@Module({
    imports: [IdentityModule],
    controllers: [BillsController],
    providers: [BillsService, BillsRepository],
})
export class BillsModule {}
