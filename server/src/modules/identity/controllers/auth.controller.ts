import type { Response } from 'express';
import { MessageResponse } from '@common/types';
import { CookiesAuthGuard } from '@common/guards';
import { LoginInputDto } from './../dto/auth.dto';
import { plainToInstance } from 'class-transformer';
import { AuthService } from '../services/auth.service';
import { Summary, UserInRequest } from '@common/decorators';
import { type User, UserResponseDto } from '../dto/user.dto';
import { CookiesService } from '../services/cookies.service';
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly cookiesService: CookiesService,
    ) {}

    @Get('me')
    @UseGuards(CookiesAuthGuard)
    @ApiCookieAuth('access_token')
    @ApiResponse({ status: 200, type: UserResponseDto, description: 'Retrieved Logged in user details.' })
    @ApiOperation({ summary: 'Get user details', description: 'Get the details of the currently logged in user.' })
    async me(@UserInRequest() user: User): Promise<UserResponseDto> {
        const userResponse = await this.authService.me(user.id!);

        return plainToInstance(UserResponseDto, userResponse);
    }

    @Post('login')
    @ApiBody({ type: LoginInputDto, required: true })
    @Summary('Login Successful.', 'The user is authenticated and tokens are stored in the cookies.')
    @ApiResponse({ status: 200, description: 'User logged in successfully.', type: UserResponseDto, isArray: false })
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
