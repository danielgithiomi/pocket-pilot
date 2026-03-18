import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../dto/account.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class AccountRepository {
    constructor(private readonly db: DatabaseService) {}

    async createNewAccount(userId: string, data: CreateAccountDto) {
        const normalizedName = data.name.toLowerCase();
        return this.db.account.create({ data: { name: normalizedName, holderId: userId } });
    }
}
