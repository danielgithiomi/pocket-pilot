import { TransactionType } from '@prisma/client';
import { CreateTransactionDto, Transaction } from '../dto/transaction.dto';
import { DatabaseService } from '@infrastructure/database/database.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TransactionService {
    constructor(private readonly db: DatabaseService) {}

    async getAllTransactions(): Promise<Transaction[]> {
        return this.db.transaction.findMany({});
    }

    async getTransactionsByAccountId(accountId: string): Promise<Transaction[]> {
        await this.confirmWalletExists(accountId);

        return this.db.transaction.findMany({
            where: { accountId },
        });
    }

    async createTransactionByAccountId(
        accountId: string,
        createTransactionDto: CreateTransactionDto,
    ): Promise<Transaction> {
        const transformedDto: CreateTransactionDto = {
            ...createTransactionDto,
            type: createTransactionDto.type.toUpperCase() as TransactionType,
        };

        if (transformedDto.type !== TransactionType.EXPENSE && transformedDto.type !== TransactionType.INCOME) {
            throw new BadRequestException({
                message: 'Invalid transaction type!',
                details: `The transaction type ${createTransactionDto.type.toUpperCase()} is not valid.`,
            });
        }

        await this.confirmWalletExists(accountId);

        return this.db.transaction.create({
            data: {
                accountId,
                ...transformedDto,
            },
        });
    }

    private async confirmWalletExists(accountId: string): Promise<void> {
        const account = await this.db.account.findUnique({
            where: { id: accountId },
        });

        if (!account) {
            throw new NotFoundException({
                message: 'Account not found!',
                details: `No account found with the ID: {${accountId}}.`,
            });
        }
    }
}
