import { Inject } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { EntityCache } from '@common/cache';
import { Account } from '../dto/account.dto';
import { hoursToSeconds } from '@libs/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CategoriesDto } from '../dto/categories.dto';
import { AccountWithTransactionsDto } from '../dto/account.dto';

export class AccountsCache extends EntityCache<Account[]> {
    constructor(@Inject(CACHE_MANAGER) protected readonly cache: Cache) {
        super(cache, 'accounts');
    }
}

export class CategoriesCache extends EntityCache<CategoriesDto> {
    constructor(@Inject(CACHE_MANAGER) protected readonly cache: Cache) {
        super(cache, 'categories', hoursToSeconds(1));
    }
}

export class AccountDetailsCache extends EntityCache<AccountWithTransactionsDto> {
    constructor(@Inject('CACHE_MANAGER') protected readonly cache: Cache) {
        super(cache, 'account-details', 30);
    }
}
