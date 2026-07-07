import { Module } from '@nestjs/common';
import { IdentityModule } from '@modules/identity/identity.module';
import { NotificationsService } from './services/notifications.service';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsRepository } from './repositories/notifications.repository';

@Module({
    imports: [IdentityModule],
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationsRepository],
    exports: [NotificationsService]
})
export class NotificationsModule {}
