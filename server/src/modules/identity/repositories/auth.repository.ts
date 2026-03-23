import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';
import { User } from '../dto/user.dto';

@Injectable()
export class AuthRepository {
    constructor(private readonly db: DatabaseService) {}

    async incrementFailedLoginAttempts(email: string): Promise<User> {
        return await this.db.user.update({
            where: { email },
            data: {
                failedLoginAttempts: {
                    increment: 1,
                },
            },
        });
    }

    async lockAccount(email: string): Promise<User> {
        return await this.db.user.update({
            where: { email },
            data: {
                isAccountLocked: true,
            },
        });
    }

    async resetFailedLoginAttemptsOnSuccessfulLogin(email: string): Promise<User> {
        const now = new Date();
        return await this.db.user.update({
            where: { email },
            data: {
                lastLoginAt: now,
                failedLoginAttempts: 0,
            },
        });
    }
}
