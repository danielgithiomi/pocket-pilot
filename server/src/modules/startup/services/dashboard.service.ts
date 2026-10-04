import { Logger, OnApplicationBootstrap } from '@nestjs/common';
import { RegisterInputDto } from '@modules/identity/dto/auth.dto';
import { UserService } from '@modules/identity/services/user.service';

export class DashboardService implements OnApplicationBootstrap {
    private readonly logger = new Logger(DashboardService.name);

    constructor(private readonly userService: UserService) {}

    async onApplicationBootstrap(): Promise<void> {
        this.logger.log('DashboardService has been initialized.');

        const superUser: RegisterInputDto = {
            name: 'Super User',
            password: 'SuperUserPassword123!',
            email: 'superuser@pocketpilot.com'
        } as const;

        try {
            await this.userService.registerUser(superUser);
            this.logger.log('Super user has been created successfully.');
        } catch (error) {
            this.logger.error('Failed to create super user:', error);
        }
    }
}
