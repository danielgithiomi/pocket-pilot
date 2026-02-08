import { FullUser, LoginInputDto, LoginOutputDto } from '../dto/user.dto';
import { DatabaseService } from '@infrastructure/database/database.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

interface ValidationResult {
    isValid: boolean;
    user: FullUser;
}

@Injectable()
export class AuthService {
    constructor(private readonly db: DatabaseService) {}

    async login(data: LoginInputDto): Promise<LoginOutputDto> {
        const { email, password } = data;

        const { isValid, user } = await this.validateUser(email, password);

        if (!isValid)
            throw new UnauthorizedException({
                message: 'Invalid credentials',
                details: `The provided email and password combination is incorrect`,
            });

        return {
            user,
            refresh_token: 'refresh_token',
            access_token: 'access_token',
        };
    }

    private async validateUser(email: string, password: string): Promise<ValidationResult> {
        const user: FullUser | null = await this.db.user.findUnique({
            where: { email },
        });

        if (!user)
            throw new NotFoundException({
                message: 'User not found',
                details: `No user found in the database with the email: ${email}`,
            });

        return {
            isValid: password === 'P@55w0rd',
            user,
        };
    }
}
