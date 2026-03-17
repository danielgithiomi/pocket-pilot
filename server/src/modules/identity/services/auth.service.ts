import * as argon from 'argon2';
import { CookiesService } from './cookies.service';
import { plainToInstance } from 'class-transformer';
import { FullUser, UserResponseDto } from '../dto/user.dto';
import { LockedException } from '@common/exceptions/locked.exception';
import { DatabaseService } from '@infrastructure/database/database.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JWTPayload, LoginInputDto, LoginOutputDto, ValidationResult } from '../dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly db: DatabaseService,
        private readonly cookiesService: CookiesService,
    ) {}

    async me(userId: string): Promise<FullUser> {
        let user: FullUser | null = null;

        user = await this.db.user.findUnique({ where: { id: userId } });

        if (!user)
            throw new UnauthorizedException({
                name: 'User not found.',
                title: 'User not authorized.',
                details: `No user found in the request with the ID: {${userId}}!`,
            });

        return user;
    }

    async login(data: LoginInputDto): Promise<LoginOutputDto> {
        const now = new Date();
        const { email, password } = data;

        const { isValid, user } = await this.validateUser(email, password);

        if (!isValid) {
            const currentFailedAttempts = user.failedLoginAttempts!;

            if (currentFailedAttempts >= 3) {
                await this.db.user.update({
                    where: { email },
                    data: {
                        isAccountLocked: true,
                    },
                });

                throw new LockedException({
                    name: 'USER_ACCOUNT_LOCKED',
                    title: 'YOUR ACCOUNT IS LOCKED',
                    message: 'Your account has been locked due to too many failed login attempts.',
                    details:
                        'Your account has been locked due to too many failed login attempts. Please contact support at support@pocket-pilot.com.',
                });
            }

            await this.db.user.update({
                where: { email },
                data: {
                    failedLoginAttempts: currentFailedAttempts + 1,
                },
            });

            throw new UnauthorizedException({
                name: 'Invalid Credentials',
                title: 'Invalid Credentials.',
                details: `Incorrect email or password. Please confirm and try again!`,
            });
        }

        const payload: JWTPayload = this.cookiesService.generatePayload(user);

        const { access_token, refresh_token } = this.cookiesService.generateTokens(payload);

        // Reset the failed login attempts
        await this.db.user.update({
            where: { email },
            data: {
                lastLoginAt: now,
                failedLoginAttempts: 0,
            },
        });

        return {
            access_token,
            refresh_token,
            user: plainToInstance(UserResponseDto, user),
        } satisfies LoginOutputDto;
    }

    // HELPER FUNCTIONS
    private async validateUser(email: string, password: string): Promise<ValidationResult> {
        const user: FullUser | null = await this.db.user.findUnique({ where: { email } });

        if (!user)
            throw new NotFoundException({
                name: 'User not found.',
                title: 'User not found.',
                details: `No user found with the email: {${email}}!`,
            });

        return {
            isValid: await this.validatePassword(password, user.password),
            user,
        };
    }

    private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return argon.verify(hashedPassword, password);
    }
}
