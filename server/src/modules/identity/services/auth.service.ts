import * as argon from 'argon2';
import { CookiesService } from './cookies.service';
import { plainToInstance } from 'class-transformer';
import { UserWithPreferencesDto } from '../dto/onboarding.dto';
import { UserRepository } from '../repositories/user.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { LockedException } from '@common/exceptions/locked.exception';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JWTPayload, LoginInputDto, LoginOutputDto, ValidationResult } from '../dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly cookiesService: CookiesService,
        private readonly userRepository: UserRepository,
        private readonly authRepository: AuthRepository,
    ) {}

    async me(userId: string): Promise<UserWithPreferencesDto> {
        const user = await this.userRepository.findUserById(userId);

        if (!user)
            throw new UnauthorizedException({
                name: 'USER_NOT_FOUND',
                title: 'User not found!',
                details: `No user found in the request with the ID: {${userId}}.`,
            });

        return plainToInstance(UserWithPreferencesDto, user, { excludeExtraneousValues: true });
    }

    async login(data: LoginInputDto): Promise<LoginOutputDto> {
        const { email, password } = data;

        const { isValid, user } = await this.validateUser(email, password);

        if (!isValid) {
            const currentFailedAttempts = user.failedLoginAttempts!;

            if (currentFailedAttempts >= 3) {
                await this.authRepository.lockAccount(email);

                throw new LockedException({
                    name: 'USER_ACCOUNT_LOCKED',
                    title: 'YOUR ACCOUNT IS LOCKED',
                    message: 'Your account has been locked due to too many failed login attempts.',
                    details:
                        'Your account has been locked due to too many failed login attempts. Please contact support at support@pocket-pilot.com.',
                });
            }

            await this.authRepository.incrementFailedLoginAttempts(email);

            throw new UnauthorizedException({
                name: 'INVALID_CREDENTIALS',
                title: 'Invalid Credentials!',
                details: `Incorrect email or password. Please confirm and try again.`,
            });
        }

        const payload: JWTPayload = this.cookiesService.generatePayload(user);

        const { access_token, refresh_token } = this.cookiesService.generateTokens(payload);

        await this.authRepository.resetFailedLoginAttemptsOnSuccessfulLogin(email);

        return {
            access_token,
            refresh_token,
            user: plainToInstance(UserWithPreferencesDto, user, { excludeExtraneousValues: true }),
        } satisfies LoginOutputDto;
    }

    // HELPER FUNCTIONS
    private async validateUser(email: string, password: string): Promise<ValidationResult> {
        const user = await this.userRepository.findUserByEmail(email);

        if (!user)
            throw new NotFoundException({
                name: 'USER_NOT_FOUND',
                title: 'Invalid email address!',
                details: `No user in our records has the email: [${email}].`,
            });

        return {
            isValid: await this.validatePassword(password, user.password),
            user,
        };
    }

    private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await argon.verify(hashedPassword, password);
    }
}
