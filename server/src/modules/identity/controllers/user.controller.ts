import { UserService } from '../services/user.service';
import { type RegisterInputDto } from '../dto/user.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    registerUser(@Body() user: RegisterInputDto) {
        return this.userService.registerUser(user);
    }
}
