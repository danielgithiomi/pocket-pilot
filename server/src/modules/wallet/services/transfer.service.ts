import { ConflictException, Injectable } from '@nestjs/common';
import { AccountDetailsCache, AccountsCache } from '../cache/wallet.cache';
import { TransactionRepository } from '../repositories/transaction.respository';
import { CompleteTransactionDto, CreateTransferTransactionPayload } from '../dto/transaction.dto';

@Injectable()
export class TransferService {
    constructor(
        // private readonly transactionsCache: TransactionCache,
        private readonly accountsCache: AccountsCache,
        private readonly accountDetailsCache: AccountDetailsCache,
        private readonly transactionRepository: TransactionRepository
    ) {}

    async createTransactionAndTransferAmountBetweenAccounts(
        userId: string,
        accountId: string,
        payload: CreateTransferTransactionPayload
    ): Promise<CompleteTransactionDto> {
        const { sourceAccountId, targetAccountId } = payload;
        this.checkSourceAccountMatches(accountId, sourceAccountId);

        const createdTransferTransaction = this.transactionRepository.createTransferTransactionAndUpdateBalances(payload);

        await this.invalidateCaches(userId, sourceAccountId, targetAccountId);
        return createdTransferTransaction;
    }

    // HELPER METHODS
    private checkSourceAccountMatches(paramAccountId: string, sourceAccountId: string) {
        if (paramAccountId === sourceAccountId) return;

        throw new ConflictException({
            name: 'SOURCE_ACCOUNT_MISMATCH',
            title: 'Mismatch between Source-ID and Param-ID',
            message: "The source account Id doesn't match the param Id",
            details: { sourceAccountId, paramAccountId }
        });
    }

    private async invalidateCaches(userId: string, sourceAccountId: string, targetAccountId: string) {
        await this.accountsCache.invalidateCache(userId);
        await this.accountDetailsCache.invalidateCaches([sourceAccountId, targetAccountId]);
        // TODO: Add cache invalidation for the transaction cache
        // this.transactionsCache.invalidateCaches([sourceAccountId, targetAccountId]);
    }
}
