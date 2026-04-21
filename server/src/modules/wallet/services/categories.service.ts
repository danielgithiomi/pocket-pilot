import { CategoryType } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '@modules/identity/dto/user.dto';
import { normalizeCategories, normalizeCategoryName } from '@libs/utils';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CategoriesCache } from '@modules/wallet/cache/categories.cache';
import { CategoriesRepository } from '../repositories/categories.repository';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@common/constants';
import { CategoriesDto, CreateCategoryDto, DeleteCategoryPayload } from '../dto/categories.dto';

@Injectable()
export class CategoriesService {
    private readonly logger = new Logger(CategoriesService.name);

    constructor(
        private readonly cache: CategoriesCache,
        private readonly categoriesRepository: CategoriesRepository,
    ) {}

    async addDefaultCategoriesOnRegistration(userId: string): Promise<boolean> {
        const normalizedIncomes = normalizeCategories(DEFAULT_INCOME_CATEGORIES);
        const normalizedExpenses = normalizeCategories(DEFAULT_EXPENSE_CATEGORIES);

        try {
            await this.categoriesRepository.populateDefaultCategories(userId, normalizedIncomes, normalizedExpenses);
            return true;
        } catch (error) {
            console.error('Error adding default categories on registration for user', userId, error);
            return false;
        }
    }

    async createCategory(userId: string, payload: CreateCategoryDto): Promise<CategoriesDto> {
        if (!Object.values(CategoryType).includes(payload.categoryType))
            throw new BadRequestException({
                name: 'InvalidCategoryType',
                message: 'Invalid category type',
                details: {
                    field: 'categoryType',
                    value: payload.categoryType,
                },
            });

        const normalisedName: string = normalizeCategoryName(payload.categoryName);

        const categoryDto = await this.categoriesRepository.createCategory(
            userId,
            normalisedName,
            payload.categoryType,
        );

        const createdCategories = plainToInstance(CategoriesDto, categoryDto);
        await this.cache.invalidateCache(userId);
        await this.cache.setCache(userId, createdCategories);
        return createdCategories;
    }

    async getAllUserCategories(user: UserResponseDto): Promise<CategoriesDto> {
        const { id: userId, name } = user;

        const cachedCategories = await this.cache.getCache(userId);
        if (cachedCategories) return cachedCategories;

        const fetchedCategories = await this.categoriesRepository.getAllUserCategories(userId);
        if (!fetchedCategories)
            return {
                id: '',
                incomes: [],
                expenses: [],
                createdAt: new Date(),
                lastUpdated: null,
                user: {
                    id: userId,
                    name,
                },
            };

        const categories: CategoriesDto = plainToInstance(CategoriesDto, fetchedCategories);
        await this.cache.setCache(userId, categories);
        return categories;
    }

    async deleteCategoryByName(userId: string, payload: DeleteCategoryPayload) {
        const { categoryName, categoryType } = payload;

        try {
            await this.categoriesRepository.deleteCategory(userId, categoryName, categoryType);
            await this.cache.invalidateCache(userId);
        } catch (error) {
            this.logger.error(`Error deleting category ${categoryName} for user ${userId}:`, error);
            throw new BadRequestException({
                name: 'INTERNAL_SERVER_ERROR',
                title: 'Internal Server Error',
                message: `Error deleting your ${categoryName} category. Please try again later.`,
                details: {
                    field: 'categoryName',
                    value: categoryName,
                },
            });
        }
    }
}
