import { Summary } from '@common/decorators';
import { UserService } from '../services/user.service';
import { DeleteResourceResponse } from '@common/types';
import { CreateUserDto, UserResponseDto } from '../dto/user.dto';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('users')
@ApiUnauthorizedResponse({ description: 'Authentication required!' })
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiBody({ type: CreateUserDto })
    @Summary('User Registration Successful.', 'The user is registered successfully.')
    @ApiResponse({ status: 201, description: 'User registered successfully', type: UserResponseDto })
    @ApiOperation({
        summary: 'Register a new user',
        description: 'Creates a new user account with the provided credentials.',
    })
    registerUser(@Body() user: CreateUserDto) {
        return this.userService.registerUser(user);
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

