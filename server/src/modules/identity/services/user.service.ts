import { User } from '../dto/user.dto';
import { RegisterInputDto } from '../dto/auth.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class UserService {
    constructor(private readonly db: DatabaseService) {}

    registerUser(data: RegisterInputDto) {
        return this.db.user.create({ data });
    }

    async findUserById(userId: string): Promise<User> {
        const user: User | null = await this.db.user.findUnique({ where: { id: userId } });

        if (!user)
            throw new NotFoundException({
                name: 'User Not Found',
                message: `No user found in the database with the ID: ${userId}`,
            });

        return user;
    }
}
