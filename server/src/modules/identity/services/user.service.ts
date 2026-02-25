import * as argon from 'argon2';
import { CookiesService } from './cookies.service';
import { plainToInstance } from 'class-transformer';
import { FullUser, User, UserResponseDto } from '../dto/user.dto';
import { DatabaseService } from '@infrastructure/database/database.service';
import { JWTPayload, RegisterInputDto, RegisterOutputDto } from '../dto/auth.dto';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(
        private readonly db: DatabaseService,
        private readonly cookiesService: CookiesService,
    ) {}

    async registerUser(data: RegisterInputDto): Promise<RegisterOutputDto> {
        const userExists = await this.validateUserExists(data.email);

        if (userExists)
            throw new ConflictException({
                name: 'User Already Exists.',
                title: 'User Already Exists.',
                details: `A user with the same email address already exists!`,
            });

        const hashedPassword = await argon.hash(data.password);

        const createdUser: FullUser = await this.db.user.create({ data: { ...data, password: hashedPassword } });

        const payload: JWTPayload = this.cookiesService.generatePayload(createdUser);

        const { access_token, refresh_token } = this.cookiesService.generateTokens(payload);

        return {
            user: plainToInstance(UserResponseDto, createdUser),
            access_token,
            refresh_token,
        } satisfies RegisterOutputDto;
    }

    async getAllUsers(): Promise<UserResponseDto[]> {
        return await this.db.user.findMany({});
    }

    async findUserById(userId: string): Promise<UserResponseDto> {
        const user: FullUser | null = await this.db.user.findUnique({ where: { id: userId } });

        if (!user)
            throw new NotFoundException({
                name: 'User Not Found.',
                title: 'User Not Found.',
                details: `No user found with the ID: {${userId}}!`,
            });

        return plainToInstance(UserResponseDto, user);
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.db.user.findUnique({ where: { email } });
    }

    async deleteUserById(userId: string) {
        return this.db.user.delete({ where: { id: userId } });
    }

    // HELPER FUNCTIONS
    private async validateUserExists(email: string): Promise<boolean> {
        const user: User | null = await this.findUserByEmail(email);
        return !!user;
    }
}
