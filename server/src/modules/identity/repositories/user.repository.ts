import { Injectable } from '@nestjs/common';
import { RegisterInputDto } from '../dto/auth.dto';
import { FullUser, UpdateUserDto } from '../dto/user.dto';
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

    async getAllUsers(): Promise<FullUser[]> {
        return await this.db.user.findMany({});
    }

    async findUserById(userId: string){
        return this.db.user.findUnique({ where: { id: userId }, include: { userPreferences: true } });
    }

    async findUserByEmail(email: string){
        return this.db.user.findUnique({ where: { email }, include: { userPreferences: true } });
    }

    async updateUserById(userId: string, data: UpdateUserDto): Promise<FullUser> {
        return this.db.user.update({ where: { id: userId }, data });
    }

    async updateUserPassword(userId: string, password: string): Promise<FullUser> {
        return this.db.user.update({ where: { id: userId }, data: { password } });
    }

    async deleteUserById(userId: string) {
        return this.db.user.delete({ where: { id: userId } });
    }
}
