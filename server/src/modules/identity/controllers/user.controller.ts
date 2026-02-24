import type { Response } from 'express';
import { Summary } from '@common/decorators';
import { UserService } from '../services/user.service';
import { DeleteResourceResponse } from '@common/types';
import { CookiesService } from '../services/cookies.service';
import { CreateUserDto, UserResponseDto } from '../dto/user.dto';
import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('users')
@ApiUnauthorizedResponse({ description: 'Authentication required!' })
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly cookiesService: CookiesService,
    ) {}

    @Post()
    @ApiBody({ type: CreateUserDto })
    @Summary('User Registration Successful.', 'The user is registered successfully.')
    @ApiResponse({ status: 201, description: 'User registered successfully', type: UserResponseDto })
    @ApiOperation({
        summary: 'Register a new user',
        description: 'Creates a new user account with the provided credentials.',
    })
    async registerUser(@Body() user: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        const { user: createdUser, access_token, refresh_token } = await this.userService.registerUser(user);

        this.cookiesService.setResponseCookies(res, access_token, refresh_token);

        return createdUser;
    }

    @Get(':userId')
    @ApiCookieAuth('access_token')
    @ApiParam({ name: 'userId', description: 'The ID of the user to retrieve' })
    @ApiResponse({ status: 404, description: 'User not found with the provided ID' })
    @ApiResponse({ status: 200, description: 'User found successfully', type: UserResponseDto })
    @ApiOperation({ summary: 'Get user by ID', description: 'Retrieves a user by their unique identifier.' })
    findUserById(@Param('userId') userId: string) {
        return this.userService.findUserById(userId);
    }

    @Delete(':userId')
    @ApiCookieAuth('access_token')
    @ApiParam({ name: 'userId', description: 'The ID of the user to delete' })
    @ApiResponse({ status: 404, description: 'User not found with the provided ID' })
    @ApiResponse({ status: 200, description: 'User deleted successfully', type: DeleteResourceResponse })
    @ApiOperation({ summary: 'Delete user by ID', description: 'Deletes a user by their unique identifier.' })
    deleteUserById(@Param('userId') userId: string) {
        return this.userService.deleteUserById(userId);
    }
}
