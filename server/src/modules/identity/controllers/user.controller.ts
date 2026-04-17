import type { Response } from 'express';
import { Summary } from '@common/decorators';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../services/user.service';
import { VoidResourceResponse } from '@common/types';
import { CookiesService } from '../services/cookies.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {
    CreateUserDto,
    UpdateUserDto,
    UserResponseDto,
    ChangePasswordDto,
    UserWithPreferencesDto,
    UsersWithCountResponseDto,
} from '../dto/user.dto';

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

    @Get()
    @Summary('Users Found.', 'All users retrieved from the database successfully.')
    @ApiOperation({ summary: 'Get all users', description: 'Retrieves all users in the database.' })
    @ApiResponse({ status: 200, description: 'All users found successfully', type: UsersWithCountResponseDto })
    async getAllUsers(): Promise<UsersWithCountResponseDto> {
        const users = await this.userService.getAllUsers();
        const userDtos = users.map(user => plainToInstance(UserWithPreferencesDto, user));

        return {
            data: userDtos,
            count: userDtos.length,
        };
    }

    @Get(':userId')
    @ApiCookieAuth('access_token')
    @ApiParam({ name: 'userId', description: 'The ID of the user to retrieve' })
    @ApiResponse({ status: 404, description: 'User not found with the provided ID' })
    @ApiResponse({ status: 200, description: 'User found successfully', type: UserWithPreferencesDto })
    @ApiOperation({ summary: 'Get user by ID', description: 'Retrieves a user by their unique identifier.' })
    findUserById(@Param('userId') userId: string): Promise<UserWithPreferencesDto> {
        return this.userService.findUserById(userId);
    }

    @Put(':userId')
    @ApiCookieAuth('access_token')
    @ApiParam({ name: 'userId', description: 'The ID of the user to update' })
    @ApiResponse({ status: 404, description: 'User not found with the provided ID' })
    @ApiResponse({ status: 200, description: 'User updated successfully', type: UserWithPreferencesDto })
    @ApiOperation({ summary: 'Update user by ID', description: 'Updates a user by their unique identifier.' })
    updateUserById(
        @Param('userId') userId: string,
        @Body() updatePayload: UpdateUserDto,
    ): Promise<UserWithPreferencesDto> {
        return this.userService.updateUserById(userId, updatePayload);
    }

    @Put(':userId/change-password')
    @ApiCookieAuth('access_token')
    @ApiParam({ name: 'userId', description: 'The ID of the user to update' })
    @ApiResponse({ status: 404, description: 'User not found with the provided ID' })
    @ApiResponse({ status: 200, description: 'User updated successfully', type: VoidResourceResponse })
    @ApiOperation({
        summary: 'Change the user password',
        description: 'Changes the password for a user by their unique identifier.',
    })
    async changePassword(
        @Param('userId') userId: string,
        @Body() payload: ChangePasswordDto,
    ): Promise<VoidResourceResponse> {
        await this.userService.changePassword(userId, payload);

        return {
            message: 'Password changed!',
            details: 'Your password has been changed successfully.',
        };
    }

    @Delete(':userId')
    @ApiCookieAuth('access_token')
    @ApiParam({ name: 'userId', description: 'The ID of the user to delete' })
    @ApiResponse({ status: 404, description: 'User not found with the provided ID' })
    @ApiResponse({ status: 200, description: 'User deleted successfully', type: VoidResourceResponse })
    @ApiOperation({ summary: 'Delete user by ID', description: 'Deletes a user by their unique identifier.' })
    async deleteUserById(@Param('userId') userId: string): Promise<VoidResourceResponse> {
        await this.userService.deleteUserById(userId);

        return {
            message: 'User deleted!',
            details: `Your user with ID: [${userId}] has been deleted successfully.`,
        };
    }
}
