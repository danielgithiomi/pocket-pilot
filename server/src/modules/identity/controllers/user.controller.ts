import { UserService } from '../services/user.service';
import { type RegisterInputDto } from '../dto/user.dto';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('users')
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
