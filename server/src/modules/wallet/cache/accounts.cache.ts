import { Inject } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { EntityCache } from '@common/cache';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Account } from '@modules/wallet/dto/account.dto';

export class AccountsCache extends EntityCache<Account[]> {
    constructor(@Inject(CACHE_MANAGER) protected readonly cache: Cache) {
        super(cache, 'accounts');
    }
}
