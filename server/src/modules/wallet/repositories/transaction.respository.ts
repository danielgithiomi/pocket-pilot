import { TransactionType } from '@prisma/client';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';
import { CreateTransactionDto, CreateTransferTransactionPayload, TransactionWithAccount } from '../dto/transaction.dto';

@Injectable()
export class TransactionRepository {
    constructor(private readonly db: DatabaseService) {}

    async getAllTransactionsAndAccountData() {
        return this.db.transaction.findMany({
            include: { account: { select: { id: true, name: true, currency: true } } },
        });
    }

    async getUserTransactionsAndAccountData(userId: string) {
        return this.db.transaction.findMany({
            where: { account: { holderId: userId } },
            include: { account: { select: { id: true, name: true, currency: true } } },
        });
    }

    async getTransactionCountByAccountId(accountId: string): Promise<number> {
        return this.db.transaction.count({
            where: { accountId },
        });
    }

    async createNewTransactionAndUpdateBalance(
        accountId: string,
        transaction: CreateTransactionDto,
    ): Promise<TransactionWithAccount> {
        return this.db.$transaction(async prisma => {
            const createdTransaction = await prisma.transaction.create({
                data: {
                    accountId,
                    ...transaction,
                },
                include: {
                    account: { select: { id: true, name: true, currency: true } },
                },
            });

            if (transaction.type === TransactionType.INCOME) {
                await prisma.account.update({
                    where: { id: accountId },
                    data: {
                        balance: {
                            increment: transaction.amount,
                        },
                    },
                });
            } else if (transaction.type === TransactionType.EXPENSE) {
                await prisma.account.update({
                    where: { id: accountId },
                    data: {
                        balance: {
                            decrement: transaction.amount,
                        },
                    },
                });
            } else {
                throw new InternalServerErrorException({
                    name: 'INVALID_TRANSACTION_TYPE',
                    title: 'Invalid transaction type!',
                    message: 'Could not create transaction with invalid type',
                    details: {
                        type: transaction.type,
                    },
                });
            }

            return createdTransaction;
        });
    }

    async createTransferTransactionAndUpdateBalances(userId: string, payload: CreateTransferTransactionPayload) {
        return this.db.$transaction(async prisma => {
            const { sourceAccountId, targetAccountId, amount } = payload;

            const createdTranferTransaction = await prisma.transaction.create({
                data: { ...payload },
                include: { account: { select: { id: true, name: true, currency: true } } },
            });

            // Decrement from source account
            await prisma.account.update({
                where: { id: sourceAccountId },
                data: { balance: { decrement: amount }}
            });

            // Increment the target account
            await prisma.account.update({
                where: { id: targetAccountId },
                data: { balance: { increment: amount } },
            });

            return createdTranferTransaction;
        });
    }

    async deleteTransactionById(transactionId: string): Promise<void> {
        await this.db.transaction.delete({
            where: { id: transactionId },
        });
    }
}
