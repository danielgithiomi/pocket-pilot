import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from '../dto/auth.dto';
import type { CookieOptions, Response } from 'express';
import { PPConfigService } from '@infrastructure/config';
import { FullUser, UserWithPreferences } from '../dto/user.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JWT_ACCESS_TOKEN_VALIDITY_MINUTES, JWT_REFRESH_TOKEN_VALIDITY_DAYS } from '@common/constants';

@Injectable()
export class CookiesService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: PPConfigService
    ) {}

    generatePayload(user: UserWithPreferences | FullUser): JWTPayload {
        return {
            sub: user.id!,
            username: user.name,
            email: user.email,
            iat: Date.now()
        } satisfies JWTPayload;
    }

    generateTokens(payload: JWTPayload): { access_token: string; refresh_token: string } {
        let access_token: string;
        let refresh_token: string;

        try {
            access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
            refresh_token = this.jwtService.sign({ sub: payload.sub }, { expiresIn: '1d' });
        } catch (error) {
            throw new InternalServerErrorException({
                name: 'JWT Token Generation Error',
                title: 'Failed to generate tokens',
                details: `An error occurred while generating the access and refresh tokens: ${error}`
            });
        }

        return { access_token, refresh_token };
    }

    setResponseCookies(res: Response, access_token: string, refresh_token: string): void {
        const access_token_max_age = JWT_ACCESS_TOKEN_VALIDITY_MINUTES * 60 * 1000;
        const refresh_token_max_age = JWT_REFRESH_TOKEN_VALIDITY_DAYS * 24 * 60 * 60 * 1000;
        const cookieOptions = this.getCookieOptions();

        res.cookie('access_token', access_token, {
            ...cookieOptions,
            maxAge: access_token_max_age
        });

        res.cookie('refresh_token', refresh_token, {
            ...cookieOptions,
            maxAge: refresh_token_max_age
        });
    }

    clearResponseCookies(res: Response): void {
        const cookieOptions = this.getCookieOptions();

        res.clearCookie('access_token', cookieOptions);
        res.clearCookie('refresh_token', cookieOptions);
    }

    private getCookieOptions(): CookieOptions {
        const isProduction = this.configService.application.environment === 'production';

        return {
            path: '/',
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax'
        };
    }
}
