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

        const payload: JWTPayload = {
            sub: user.id!,
            username: user.name,
            email: user.email,
            iat: Date.now(),
        };

        let access_token: string;
        let refresh_token: string;

        try {
            access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
            refresh_token = this.jwtService.sign({ sub: user.id }, { expiresIn: '1d' });
        } catch (error) {
            throw new InternalServerErrorException({
                name: 'JWT Token Generation Error',
                title: 'Failed to generate tokens',
                details: `An error occurred while generating the access and refresh tokens: ${error}`,
            });
        }

        return {
            user,
            refresh_token,
            access_token,
        };
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
            isValid: password === user.password,
            user,
        };
    }
}
