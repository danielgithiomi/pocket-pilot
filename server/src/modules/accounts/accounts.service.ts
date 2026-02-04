import { Injectable } from '@nestjs/common';
import {DatabaseService} from "../../infrastructure/database/database.service";
import {AccountDto} from "./dtos/account.dto";

@Injectable()
export class AccountsService {

    constructor(private readonly db: DatabaseService) {}

    createAccount(data: AccountDto){
        return this.db.account.create({ data })
    }

}
