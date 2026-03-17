import * as argon from 'argon2';
import { CookiesService } from './cookies.service';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '../repositories/user.repository';
import { FullUser, User, UserResponseDto } from '../dto/user.dto';
import { JWTPayload, RegisterInputDto, RegisterOutputDto } from '../dto/auth.dto';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(
        private readonly cookiesService: CookiesService,
        private readonly userRepository: UserRepository,
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

        const createdUser: FullUser = await this.userRepository.createNewUser(data, hashedPassword);

        const payload: JWTPayload = this.cookiesService.generatePayload(createdUser);

        const { access_token, refresh_token } = this.cookiesService.generateTokens(payload);

        return {
            user: plainToInstance(UserResponseDto, createdUser),
            access_token,
            refresh_token,
        } satisfies RegisterOutputDto;
    }

    async getAllUsers(): Promise<UserResponseDto[]> {
        return await this.userRepository.getAllUsers();
    }

    async deleteUserById(userId: string) {
        return this.userRepository.deleteUserById(userId);
    }

    async findUserById(userId: string): Promise<UserResponseDto> {
        const user: FullUser | null = await this.userRepository.findUserById(userId);

        if (!user)
            throw new NotFoundException({
                name: 'User Not Found.',
                title: 'User Not Found.',
                details: `No user found with the ID: {${userId}}!`,
            });

        return plainToInstance(UserResponseDto, user);
    }

    // HELPER FUNCTIONS
    private async validateUserExists(email: string): Promise<boolean> {
        const user: User | null = await this.userRepository.findUserByEmail(email);
        return !!user;
    }
}
