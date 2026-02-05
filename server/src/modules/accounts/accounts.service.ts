import {Injectable} from '@nestjs/common';
import {AccountDto} from './dtos/account.dto';
import {DatabaseService} from '../../infrastructure/database/database.service';

@Injectable()
export class AccountsService {
    constructor(private readonly db: DatabaseService) {
    }

  getAllWallets() {
    return this.db.account.findMany({});
  }

  createAccount(data: AccountDto) {
      return this.db.account.create({data});
  }
}
