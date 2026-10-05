import { RegisterInputDto } from '@modules/identity/dto/auth.dto';
import { ConflictException, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { UserService } from '@modules/identity/services/user.service';

@Injectable()
export class DashboardService implements OnApplicationBootstrap {
    private readonly logger = new Logger(DashboardService.name);

    constructor(private readonly userService: UserService) {}

    async onApplicationBootstrap(): Promise<void> {
        const superUser: RegisterInputDto = {
            name: 'Super User',
            password: 'SuperUserPassword123!',
            email: 'superuser@pocketpilot.com'
        } as const;

        try {
            await this.userService.registerUser(superUser);
        } catch (error) {
            if (error instanceof ConflictException) {
                this.logger.warn('Super user already exists. Skipping creation.');
                return;
            }

            this.logger.error('Failed to create super user:', error);
        }
    }
}
