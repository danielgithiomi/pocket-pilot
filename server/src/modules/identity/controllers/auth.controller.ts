import type { Response } from 'express';
import { Summary } from '@common/decorators';
import { type LoginInputDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { Body, Controller, Post, Res } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @Summary('User Login Successful.', 'The user is authenticated and token stored in the cookies.')
    async login(@Body() loginDto: LoginInputDto, @Res({ passthrough: true }) res: Response) {
        const { user, access_token, refresh_token } = await this.authService.login(loginDto);

        this.setResponseCookies(res, access_token, refresh_token);

        return user;
    }

    @Post('logout')
    @Summary('User Logout Successful.', 'The user is logged out and token is cleared from the cookies.')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        return {
            message: 'User logged out successfully',
        };
    }

    private setResponseCookies(res: Response, access_token: string, refresh_token: string): void {
        const access_token_max_age_hours = 1;
        const refresh_token_max_age_days = 1;

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * (60 * access_token_max_age_hours),
        });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * (24 * refresh_token_max_age_days),
        });
    }
}
