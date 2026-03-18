import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { DatabaseService } from '@infrastructure/database/database.service';
import { CreateTransactionDto, TransactionWithAccount } from '../dto/transaction.dto';

@Injectable()
export class TransactionRepository {
    constructor(private readonly db: DatabaseService) {}

    async getAllTransactionsAndAccountData() {
        return this.db.transaction.findMany({
            include: { account: { select: { id: true, name: true } } },
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
                select: {
                    id: true,
                    amount: true,
                    type: true,
                    category: true,
                    date: true,
                    account: { select: { id: true, name: true } },
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
            }

            return createdTransaction;
        });
    }
}
