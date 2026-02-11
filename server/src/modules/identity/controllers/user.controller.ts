import { UserService } from '../services/user.service';
import { type RegisterInputDto } from '../dto/auth.dto';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('users')
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({ description: 'Authentication required!' })
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    registerUser(@Body() user: RegisterInputDto) {
        return this.userService.registerUser(user);
    }

    @Get(':userId')
    findUserById(@Param('userId') userId: string) {
        return this.userService.findUserById(userId);
    }
}
