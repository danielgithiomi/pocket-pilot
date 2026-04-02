import { CategoryType } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '@modules/identity/dto/user.dto';
import { normalizeCategories, normalizeCategoryName } from '@libs/utils';
import { CategoriesRepository } from '../repositories/categories.repository';
import { DEFAULT_INCOME_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES } from '@libs/constants';
import { CategoriesDto, CreateCategoryDto, DeleteCategoryPayload } from '../dto/categories.dto';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class CategoriesService {
    private readonly logger = new Logger(CategoriesService.name);

    constructor(private readonly categoriesRepository: CategoriesRepository) {}

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

        const normalisedName = normalizeCategoryName(payload.categoryName);

        const categoryDto = await this.categoriesRepository.createCategory(
            userId,
            normalisedName,
            payload.categoryType,
        );

        return plainToInstance(CategoriesDto, categoryDto);
    }

    async getAllUserCategories(user: UserResponseDto): Promise<CategoriesDto> {
        const { id: userId, name } = user;
        const categories = await this.categoriesRepository.getAllUserCategories(userId);

        if (!categories)
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

        return plainToInstance(CategoriesDto, categories);
    }

    async deleteCategoryByName(userId: string, payload: DeleteCategoryPayload) {
        const { categoryName, categoryType } = payload;

        try {
            await this.categoriesRepository.deleteCategory(userId, categoryName, categoryType);
        } catch (error) {
            this.logger.error(`Error deleting category ${categoryName} for user ${userId}:`, error);
            throw new InternalServerErrorException({
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
