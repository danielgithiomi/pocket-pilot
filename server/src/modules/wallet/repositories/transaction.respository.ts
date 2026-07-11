import { TransactionType } from '@prisma/client';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';
import { ExchangeRateService } from '@modules/exchange-rate/services/exchange-rate.service';
import { CompleteTransactionDto, CreateTransactionDto, CreateTransferTransactionPayload } from '../dto/transaction.dto';

@Injectable()
export class TransactionRepository {
    constructor(
        private readonly db: DatabaseService,
        private readonly exchangeRateService: ExchangeRateService
    ) {}

    async getAllTransactionsAndAccountData() {
        return this.db.transaction.findMany({
            include: {
                sourceAccount: { select: { id: true, name: true, currency: true } },
                targetAccount: { select: { id: true, name: true, currency: true } }
            }
        });
    }

    async getAllTransactionsRelatedToAccountId(accountId: string) {
        return this.db.transaction.findMany({
            where: { OR: [{ sourceAccountId: accountId }, { targetAccountId: accountId }] },
            include: {
                sourceAccount: { select: { id: true, name: true, currency: true } },
                targetAccount: { select: { id: true, name: true, currency: true } }
            }
        });
    }

    async getUserPlainTransactionsByAccountId(accountId: string) {
        return this.db.transaction.findMany({
            where: { OR: [{ sourceAccountId: accountId }, { targetAccountId: accountId }] }
        });
    }

    async getUserTransactionsAndAccountData(userId: string) {
        return this.db.transaction.findMany({
            where: {
                OR: [{ sourceAccount: { holderId: userId } }, { targetAccount: { holderId: userId } }]
            },
            include: {
                sourceAccount: { select: { id: true, name: true, currency: true } },
                targetAccount: { select: { id: true, name: true, currency: true } }
            }
        });
    }

    async getTransactionCountByAccountId(accountId: string): Promise<number> {
        return this.db.transaction.count({
            where: { sourceAccountId: accountId }
        });
    }

    async createNewTransactionAndUpdateBalance(
        accountId: string,
        transaction: CreateTransactionDto
    ): Promise<CompleteTransactionDto> {
        return this.db.$transaction(async prisma => {
            let createdTransaction: CompleteTransactionDto;

            try {
                createdTransaction = await prisma.transaction.create({
                    data: {
                        sourceAccountId: accountId,
                        ...transaction
                    },
                    include: {
                        sourceAccount: { select: { id: true, name: true, currency: true } },
                        targetAccount: { select: { id: true, name: true, currency: true } }
                    }
                });
            } catch (error) {
                throw new InternalServerErrorException({
                    details: error,
                    name: 'TRANSFER_TRANSACTION_CREATION_ERROR',
                    title: 'Error in creating a transfer transaction',
                    message: 'There was an error creating the new transfer transaction'
                });
            }

            if (transaction.type === TransactionType.INCOME) {
                await prisma.account.update({
                    where: { id: accountId },
                    data: {
                        balance: {
                            increment: transaction.amount
                        }
                    }
                });
            } else if (transaction.type === TransactionType.EXPENSE) {
                await prisma.account.update({
                    where: { id: accountId },
                    data: {
                        balance: {
                            decrement: transaction.amount
                        }
                    }
                });
            } else {
                throw new InternalServerErrorException({
                    name: 'INVALID_TRANSACTION_TYPE',
                    title: 'Invalid transaction type!',
                    message: 'Could not create transaction with invalid type',
                    details: {
                        type: transaction.type
                    }
                });
            }

            return createdTransaction;
        });
    }

    async createTransferTransactionAndUpdateBalances(payload: CreateTransferTransactionPayload): Promise<CompleteTransactionDto> {
        return this.db.$transaction(async prisma => {
            let createdTransferTransaction: CompleteTransactionDto;
            const { sourceAccountId, targetAccountId } = payload;

            try {
                createdTransferTransaction = await prisma.transaction.create({
                    data: { ...payload },
                    include: {
                        sourceAccount: { select: { id: true, name: true, currency: true } },
                        targetAccount: { select: { id: true, name: true, currency: true } }
                    }
                });
            } catch (error) {
                throw new InternalServerErrorException({
                    details: error,
                    name: 'TRANSFER_TRANSACTION_CREATION_ERROR',
                    title: 'Error in creating a transfer transaction',
                    message: 'There was an error creating the new transfer transaction'
                });
            }

            const { sourceAmount, targetAmount } = await this.getTransferAmounts(createdTransferTransaction);

            // Decrement from source account
            await prisma.account.update({
                where: { id: sourceAccountId },
                data: { balance: { decrement: sourceAmount } }
            });

            // Increment of the target account
            await prisma.account.update({
                where: { id: targetAccountId },
                data: { balance: { increment: targetAmount } }
            });

            return createdTransferTransaction;
        });
    }

    async deleteTransactionById(transactionId: string): Promise<void> {
        await this.db.transaction.delete({
            where: { id: transactionId }
        });
    }

    // HELPER FUNCTIONS
    private async getTransferAmounts(
        createdTransaction: CompleteTransactionDto
    ): Promise<{ sourceAmount: number; targetAmount: number }> {
        if (!createdTransaction.targetAccount)
            throw new InternalServerErrorException({
                name: 'TARGET_ACCOUNT_NOT_FOUND',
                title: 'Target account not found!',
                message: 'Could not create transaction with no target account',
                details: {
                    transaction: createdTransaction,
                    transactionId: createdTransaction.id,
                    sourceAccount: createdTransaction.sourceAccount
                }
            });

        const {
            amount,
            sourceAccount: { currency: sourceAccountCurrency },
            targetAccount: { currency: targetAccountCurrency }
        } = createdTransaction;

        if (targetAccountCurrency !== sourceAccountCurrency) {
            const conversion = await this.exchangeRateService.performCurrencyConversion(
                amount,
                sourceAccountCurrency,
                targetAccountCurrency
            );

            return { sourceAmount: conversion.source.amount, targetAmount: conversion.target.amount };
        }

        return { sourceAmount: amount, targetAmount: amount };
    }
}
