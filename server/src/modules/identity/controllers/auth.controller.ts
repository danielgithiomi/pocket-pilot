import type { Response } from 'express';
import { Summary } from '@common/decorators';
import { type LoginInputDto } from '../dto/user.dto';
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

    private setResponseCookies(res: Response, access_token: string, refresh_token: string): void {
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60,
        });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24,
        });
    }
}
