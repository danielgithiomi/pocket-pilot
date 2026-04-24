import { type Cache } from 'cache-manager';
import { EntityCache } from '@common/cache';
import { Inject, Injectable } from '@nestjs/common';
import { AccountWithTransactionsDto } from '../dto/account.dto';

@Injectable()
export class AccountDetailsCache extends EntityCache<AccountWithTransactionsDto> {
    constructor(@Inject('CACHE_MANAGER') protected readonly cache: Cache) {
        super(cache, 'account-details', 30);
    }
}
