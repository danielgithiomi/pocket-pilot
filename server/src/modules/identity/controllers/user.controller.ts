import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { type UserDto } from '../dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() user: UserDto) {
    return this.userService.createUser(user);
  }
}
