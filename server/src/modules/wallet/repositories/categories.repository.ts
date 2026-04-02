import { CategoryType } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class CategoriesRepository {
    constructor(private readonly db: DatabaseService) {}

    populateDefaultCategories(userId: string, incomes: string[], expenses: string[]) {
        return this.db.categories.create({
            data: {
                userId,
                incomes,
                expenses,
                createdAt: new Date(),
            },
            include: {
                user: { select: { id: true, name: true } },
            },
        });
    }

    getAllUserCategories(userId: string) {
        return this.db.categories.findUnique({
            where: { userId },
            include: {
                user: { select: { id: true, name: true } },
            },
        });
    }

    createCategory(userId: string, name: string, type: CategoryType) {
        return this.db.$transaction(async prisma => {
            const userCategories = await prisma.categories.findUnique({
                where: { userId },
            });

            if (!userCategories) {
                throw new NotFoundException({
                    name: 'CATEGORIES_NOT_FOUND',
                    title: 'Categories not found!',
                    details: 'No categories found for this user in the database.',
                });
            }

            let mergedIncomes: string[];
            let mergedExpenses: string[];

            switch (type) {
                case CategoryType.INCOME: {
                    const existingIncomes = userCategories.incomes;
                    mergedExpenses = userCategories.expenses;
                    mergedIncomes = Array.from(new Set([...existingIncomes, name]));
                    break;
                }
                case CategoryType.EXPENSE: {
                    const existingExpenses = userCategories.expenses;
                    mergedIncomes = userCategories.incomes;
                    mergedExpenses = Array.from(new Set([...existingExpenses, name]));
                    break;
                }
            }

            return prisma.categories.update({
                where: { userId },
                data: {
                    incomes: mergedIncomes,
                    expenses: mergedExpenses,
                    lastUpdated: new Date(),
                },
                include: {
                    user: { select: { id: true, name: true } },
                },
            });
        });
    }

    async deleteCategory(userId: string, name: string, type: CategoryType) {
        await this.db.$transaction(async prisma => {
            const userCategories = await prisma.categories.findUnique({
                where: { userId },
            });

            if (!userCategories) {
                throw new NotFoundException({
                    name: 'CATEGORIES_NOT_FOUND',
                    title: 'Categories not found!',
                    details: 'No categories found for this user in the database.',
                });
            }

            let filteredIncomes: string[];
            let filteredExpenses: string[];

            switch (type) {
                case CategoryType.INCOME: {
                    const existingIncomes = userCategories.incomes;
                    filteredExpenses = userCategories.expenses;
                    filteredIncomes = existingIncomes.filter(income => income !== name);
                    break;
                }
                case CategoryType.EXPENSE: {
                    const existingExpenses = userCategories.expenses;
                    filteredIncomes = userCategories.incomes;
                    filteredExpenses = existingExpenses.filter(expense => expense !== name);
                    break;
                }
            }

            return prisma.categories.update({
                where: { userId },
                data: {
                    incomes: filteredIncomes,
                    expenses: filteredExpenses,
                    lastUpdated: new Date(),
                },
                include: {
                    user: { select: { id: true, name: true } },
                },
            });
        });
    }
}
