import * as argon from 'argon2';
import { CookiesService } from './cookies.service';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '../repositories/user.repository';
import { JWTPayload, RegisterInputDto, RegisterOutputDto } from '../dto/auth.dto';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ChangePasswordDto, FullUser, UpdateUserDto, User, UserResponseDto } from '../dto/user.dto';

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
                name: 'USER_NOT_FOUND!',
                title: 'User Not Found!',
                details: `No user found with the ID: [${userId}].`,
            });

        return plainToInstance(UserResponseDto, user);
    }

    async updateUserById(userId: string, user: UpdateUserDto) {
        const updatedUser = await this.userRepository.updateUserById(userId, user);
        return plainToInstance(UserResponseDto, updatedUser);
    }

    async changePassword(userId: string, payload: ChangePasswordDto) {
        const user: FullUser | null = await this.userRepository.findUserById(userId);

        if (!user) {
            throw new NotFoundException({
                name: 'USER_NOT_FOUND!',
                title: 'User Not Found!',
                details: `No user found with the ID: [${userId}].`,
            });
        }

        const passwordsMatch = await this.confirmOldPasswordMatch(user.password, payload.currentPassword);

        if (!passwordsMatch) {
            throw new ConflictException({
                name: 'PASSWORD_MISMATCH',
                title: 'Password mismatch!',
                details: `Your old password does not match our records. Please try again.`,
            });
        }

        const hashedPassword = await argon.hash(payload.newPassword);

        await this.userRepository.updateUserPassword(userId, hashedPassword);
    }

    // HELPER FUNCTIONS
    private async validateUserExists(email: string): Promise<boolean> {
        const user: User | null = await this.userRepository.findUserByEmail(email);
        return !!user;
    }

    private async confirmOldPasswordMatch(hashedPassword: string, password: string): Promise<boolean> {
        return await argon.verify(hashedPassword, password);
    }
}
