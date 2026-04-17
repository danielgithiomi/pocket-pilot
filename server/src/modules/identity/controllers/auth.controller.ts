import type { Response } from 'express';
import { MessageResponse } from '@common/types';
import { CookiesAuthGuard } from '@common/guards';
import { LoginInputDto } from './../dto/auth.dto';
import { plainToInstance } from 'class-transformer';
import { AuthService } from '../services/auth.service';
import { Summary, UserInRequest } from '@common/decorators';
import { CookiesService } from '../services/cookies.service';
import { UserWithPreferencesDto, type User } from '../dto/user.dto';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly cookiesService: CookiesService,
    ) {}

    @Get('me')
    @HttpCode(200)
    @UseGuards(CookiesAuthGuard)
    @ApiCookieAuth('access_token')
    @ApiResponse({ status: 200, type: UserWithPreferencesDto, description: 'Retrieved Logged in user details.' })
    @ApiOperation({ summary: 'Get user details', description: 'Get the details of the currently logged in user.' })
    async me(@UserInRequest() user: User): Promise<UserWithPreferencesDto> {
        const userResponse = await this.authService.me(user.id!);

        return plainToInstance(UserWithPreferencesDto, userResponse);
    }

    @Post('login')
    @HttpCode(200)
    @ApiBody({ type: LoginInputDto, required: true })
    @Summary('Login Successful.', 'The user is authenticated and tokens are stored in the cookies.')
    @ApiResponse({
        status: 200,
        isArray: false,
        type: UserWithPreferencesDto,
        description: 'User logged in successfully.',
    })
    @ApiOperation({
        summary: 'Log in a registered user',
        description: 'Log in as a registered user and store the access and refresh tokens in the cookies.',
    })
    async login(@Body() loginDto: LoginInputDto, @Res({ passthrough: true }) res: Response) {
        const { user, access_token, refresh_token } = await this.authService.login(loginDto);

        this.cookiesService.setResponseCookies(res, access_token, refresh_token);

        return user;
    }

    @Post('logout')
    @HttpCode(200)
    @UseGuards(CookiesAuthGuard)
    @ApiCookieAuth('access_token')
    @ApiResponse({ status: 200, description: 'User logged out successfully.', type: MessageResponse })
    @Summary('User Logout Successful.', 'The user is logged out and token is cleared from the cookies.')
    @ApiOperation({
        summary: 'Log out current user',
        description: 'Log out the current user and clear the access and refresh tokens from the cookies.',
    })
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        return {
            message: 'User logged out successfully',
        };
    }
}
