import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { FullUser } from '../dto/user.dto';
import { DatabaseService } from '@infrastructure/database/database.service';
import { JWTPayload, LoginInputDto, LoginOutputDto, ValidationResult } from '../dto/auth.dto';
import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private readonly db: DatabaseService,
        private readonly jwtService: JwtService,
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

        const payload: JWTPayload = this.createPayload(user);

        const { access_token, refresh_token } = this.generateTokens(payload);

        return {
            user,
            access_token,
            refresh_token,
        };
    }

    // HELPER FUNCTIONS
    private createPayload(user: FullUser): JWTPayload {
        return {
            sub: user.id!,
            username: user.name,
            email: user.email,
            iat: Date.now(),
        };
    }

    private generateTokens(payload: JWTPayload): { access_token: string; refresh_token: string } {
        let access_token: string;
        let refresh_token: string;

        try {
            access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
            refresh_token = this.jwtService.sign({ sub: payload.sub }, { expiresIn: '1d' });
        } catch (error) {
            throw new InternalServerErrorException({
                name: 'JWT Token Generation Error',
                title: 'Failed to generate tokens',
                details: `An error occurred while generating the access and refresh tokens: ${error}`,
            });
        }

        return { access_token, refresh_token };
    }

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
