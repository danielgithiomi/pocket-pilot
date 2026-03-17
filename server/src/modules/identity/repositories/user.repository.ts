import { Injectable } from '@nestjs/common';
import { RegisterInputDto } from '../dto/auth.dto';
import { FullUser, User, UserResponseDto } from '../dto/user.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class UserRepository {
    constructor(private readonly db: DatabaseService) {}

    async createNewUser(data: RegisterInputDto, hashedPassword: string): Promise<FullUser> {
        const now = new Date();
        const newUser = {
            ...data,
            lastLoginAt: now,
            password: hashedPassword,
        };
        return await this.db.user.create({ data: newUser });
    }

    async getAllUsers(): Promise<UserResponseDto[]> {
        return await this.db.user.findMany({});
    }

    async findUserById(userId: string): Promise<FullUser | null> {
        return this.db.user.findUnique({ where: { id: userId } });
    }

    async findUserByEmail(email: string): Promise<FullUser | null> {
        return this.db.user.findUnique({ where: { email } });
    }

    async deleteUserById(userId: string) {
        return this.db.user.delete({ where: { id: userId } });
    }

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
