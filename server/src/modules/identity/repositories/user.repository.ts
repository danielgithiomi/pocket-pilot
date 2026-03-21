import { Injectable } from '@nestjs/common';
import { RegisterInputDto } from '../dto/auth.dto';
import { FullUser, UpdateUserDto, UserResponseDto } from '../dto/user.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class UserRepository {
    constructor(private readonly db: DatabaseService) {}

    async createNewUser(data: RegisterInputDto, hashedPassword: string): Promise<FullUser> {
        const now = new Date();
        const newUser = {
            ...data,
            lastLoginAt: now,
            password: hashedPassword,
        };
        return await this.db.user.create({ data: newUser });
    }

    async getAllUsers(): Promise<UserResponseDto[]> {
        return await this.db.user.findMany({});
    }

    async findUserById(userId: string): Promise<FullUser | null> {
        return this.db.user.findUnique({ where: { id: userId } });
    }

    async findUserByEmail(email: string): Promise<FullUser | null> {
        return this.db.user.findUnique({ where: { email } });
    }

    async updateUserById(userId: string, data: UpdateUserDto): Promise<FullUser> {
        return this.db.user.update({ where: { id: userId }, data });
    }

    async deleteUserById(userId: string) {
        return this.db.user.delete({ where: { id: userId } });
    }
}
