import * as argon from 'argon2';
import { CookiesService } from './cookies.service';
import { plainToInstance } from 'class-transformer';
import { FullUser, UserResponseDto } from '../dto/user.dto';
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
        const user: FullUser | null = await this.db.user.findUnique({ where: { id: userId } });

        if (!user)
            throw new NotFoundException({
                name: 'User not found.',
                title: 'User not found.',
                details: `No user found with the ID: ${userId}!`,
            });

        return user;
    }

    async login(data: LoginInputDto): Promise<LoginOutputDto> {
        const { email, password } = data;

        const { isValid, user } = await this.validateUser(email, password);

        if (!isValid)
            throw new UnauthorizedException({
                name: 'Invalid Credentials',
                title: 'Invalid Credentials.',
                details: `Incorrect email or password. Please confirm and try again!`,
            });

        const payload: JWTPayload = this.cookiesService.generatePayload(user);

        const { access_token, refresh_token } = this.cookiesService.generateTokens(payload);

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
                details: `No user found with the email: ${email}!`,
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
