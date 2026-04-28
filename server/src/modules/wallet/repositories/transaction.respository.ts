import { TransactionType } from '@prisma/client';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';
import { CompleteTranferDto, CreateTransactionDto, CreateTransferTransactionPayload } from '../dto/transaction.dto';

@Injectable()
export class TransactionRepository {
    constructor(private readonly db: DatabaseService) {}

    async getAllTransactionsAndAccountData() {
        return this.db.transaction.findMany({
            include: {
                sourceAccount: { select: { id: true, name: true, currency: true } },
                targetAccount: { select: { id: true, name: true, currency: true } },
            },
        });
    }

    async getUserPlainTransactionsByAccountId(accountId: string) {
        return this.db.transaction.findMany({
            where: { OR: [{ sourceAccountId: accountId }, { targetAccountId: accountId }] },
        });
    }

    async getUserTransactionsAndAccountData(userId: string) {
        return this.db.transaction.findMany({
            where: {
                OR: [{ sourceAccount: { holderId: userId } }, { targetAccount: { holderId: userId } }],
            },
            include: {
                sourceAccount: { select: { id: true, name: true, currency: true } },
                targetAccount: { select: { id: true, name: true, currency: true } },
            },
        });
    }

    async getTransactionCountByAccountId(accountId: string): Promise<number> {
        return this.db.transaction.count({
            where: { sourceAccountId: accountId },
        });
    }

    async createNewTransactionAndUpdateBalance(
        accountId: string,
        transaction: CreateTransactionDto,
    ): Promise<CompleteTranferDto> {
        return this.db.$transaction(async prisma => {
            let createdTransaction;

            try {
                createdTransaction = await prisma.transaction.create({
                    data: {
                        sourceAccountId: accountId,
                        ...transaction,
                    },
                    include: {
                        sourceAccount: { select: { id: true, name: true, currency: true } },
                        targetAccount: { select: { id: true, name: true, currency: true } },
                    },
                });
            } catch (error) {
                throw new InternalServerErrorException({
                    details: error,
                    name: 'TRANSFER_TRANSACTION_CREATION_ERROR',
                    title: 'Error in creating a transfer transaction',
                    message: 'There was an error creating the new transfer transaction',
                });
            }

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

    async createTransferTransactionAndUpdateBalances(
        payload: CreateTransferTransactionPayload,
    ): Promise<CompleteTranferDto> {
        return this.db.$transaction(async prisma => {
            let createdTransferTransaction: CompleteTranferDto;
            const { sourceAccountId, targetAccountId, amount } = payload;

            try {
                createdTransferTransaction = await prisma.transaction.create({
                    data: { ...payload },
                    include: {
                        sourceAccount: { select: { id: true, name: true, currency: true } },
                        targetAccount: { select: { id: true, name: true, currency: true } },
                    },
                });
            } catch (error) {
                throw new InternalServerErrorException({
                    details: error,
                    name: 'TRANSFER_TRANSACTION_CREATION_ERROR',
                    title: 'Error in creating a transfer transaction',
                    message: 'There was an error creating the new transfer transaction',
                });
            }

            // Decrement from source account
            await prisma.account.update({
                where: { id: sourceAccountId },
                data: { balance: { decrement: amount } },
            });

            // Increment the target account
            await prisma.account.update({
                where: { id: targetAccountId },
                data: { balance: { increment: amount } },
            });

            return createdTransferTransaction;
        });
    }

    async deleteTransactionById(transactionId: string): Promise<void> {
        await this.db.transaction.delete({
            where: { id: transactionId },
        });
    }
}
