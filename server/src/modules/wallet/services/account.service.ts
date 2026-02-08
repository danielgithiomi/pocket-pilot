import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../dto/account.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class AccountService {
    constructor(private readonly db: DatabaseService) {}

    getUserAccounts(holderId: string) {
        return this.db.account.findMany({ where: { holderId } });
    }

    createAccount(data: CreateAccountDto) {
        return this.db.account.create({
            data: {
                name: data.name,
                holderId: '5552f421-6784-4318-9da1-703a7cbc8b44',
            },
        });
    }
}
