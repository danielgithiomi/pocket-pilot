import { User } from '../dto/user.dto';
import { RegisterInputDto } from '../dto/auth.dto';
import { DatabaseService } from '@infrastructure/database/database.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(private readonly db: DatabaseService) {}

    async registerUser(data: RegisterInputDto) {
        const userExists = await this.validateUserExists(data.email);
        if (userExists)
            throw new ConflictException({
                name: 'User Already Exists.',
                title: 'User Already Exists.',
                details: `A user with the same email address already exists!`,
            });

        return this.db.user.create({ data });
    }

    async findUserById(userId: string): Promise<User> {
        const user: User | null = await this.db.user.findUnique({ where: { id: userId } });

        if (!user)
            throw new NotFoundException({
                name: 'User Not Found.',
                title: 'User Not Found.',
                details: `No user found with the ID: ${userId}!`,
            });

        return user;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.db.user.findUnique({ where: { email } });
    }

    async deleteUserById(userId: string) {
        return this.db.user.delete({ where: { id: userId } });
    }

    private async validateUserExists(email: string): Promise<boolean> {
        const user: User | null = await this.findUserByEmail(email);
        return !!user;
    }
}
