import {type LoginInputDto} from '../dto/user.dto';
import {AuthService} from '../services/auth.service';
import {Body, Controller, Post} from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('login')
    async login(@Body() loginDto: LoginInputDto) {
        return (await this.authService.login(loginDto))
            ? {
                message: 'Login successful',
            }
            : {
                message: 'Invalid credentials',
            };
    }
}
