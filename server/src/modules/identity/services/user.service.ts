import * as argon from 'argon2';
import { CookiesService } from './cookies.service';
import { plainToInstance } from 'class-transformer';
import { AwsService } from '@modules/aws/aws.service';
import { UserRepository } from '../repositories/user.repository';
import { CategoriesService } from '@modules/wallet/services/categories.service';
import { JWTPayload, RegisterInputDto, RegisterOutputDto } from '../dto/auth.dto';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {
    UpdateUserDto,
    UserResponseDto,
    ChangePasswordDto,
    UserWithPreferences,
    UserWithPreferencesDto,
} from '../dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly awsService: AwsService,
        private readonly cookiesService: CookiesService,
        private readonly userRepository: UserRepository,
        private readonly categoriesService: CategoriesService,
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

        const createdUser = await this.userRepository.createNewUser(data, hashedPassword);

        const payload: JWTPayload = this.cookiesService.generatePayload(createdUser);

        const { access_token, refresh_token } = this.cookiesService.generateTokens(payload);

        await this.categoriesService.addDefaultCategoriesOnRegistration(createdUser.id!);

        return {
            user: plainToInstance(UserResponseDto, createdUser),
            access_token,
            refresh_token,
        } satisfies RegisterOutputDto;
    }

    async getAllUsers(): Promise<UserWithPreferencesDto[]> {
        const users = await this.userRepository.getAllUsers();
        return Promise.all(users.map(user => this.toUserPreferenceDto(user)));
    }

    async findUserById(userId: string): Promise<UserWithPreferencesDto> {
        const user = await this.userRepository.findUserById(userId);

        if (!user)
            throw new NotFoundException({
                name: 'USER_NOT_FOUND!',
                title: 'User Not Found!',
                details: `No user found with the ID: [${userId}].`,
            });

        return this.toUserPreferenceDto(user);
    }

    async updateUserById(userId: string, updatePayload: UpdateUserDto): Promise<UserWithPreferencesDto> {
        const updatedUser = await this.userRepository.updateUserById(userId, updatePayload);
        return this.toUserPreferenceDto(updatedUser);
    }

    async changePassword(userId: string, payload: ChangePasswordDto): Promise<UserWithPreferencesDto> {
        const user = await this.userRepository.findUserById(userId);

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

        const updatedUser = await this.userRepository.updateUserPassword(userId, hashedPassword);

        return this.toUserPreferenceDto(updatedUser);
    }

    async updateUserProfileWithPictureKey(userId: string, profilePictureAwsKey: string) {
        const userWithProfilePictureKey = await this.userRepository.updateUserProfilePictureKey(
            userId,
            profilePictureAwsKey,
        );

        return this.toUserPreferenceDto(userWithProfilePictureKey);
    }

    async deleteUserById(userId: string) {
        return this.userRepository.deleteUserById(userId);
    }

    // HELPER FUNCTIONS
    private async validateUserExists(email: string): Promise<boolean> {
        const user = await this.userRepository.findUserByEmail(email);
        return !!user;
    }

    private async confirmOldPasswordMatch(hashedPassword: string, password: string): Promise<boolean> {
        return await argon.verify(hashedPassword, password);
    }

    private async toUserPreferenceDto(user: UserWithPreferences): Promise<UserWithPreferencesDto> {
        const userWithProfilePicture = {
            ...user,
            profilePictureUrl: await this.awsService.checkAndGenerateProfilePictureUrl(user.profilePictureKey),
        };

        return plainToInstance(UserWithPreferencesDto, userWithProfilePicture);
    }
}
