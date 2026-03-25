import { normalizeCategories } from '@libs/utils';
import { plainToInstance } from 'class-transformer';
import { CategoriesDto } from '../dto/categories.dto';
import { UserResponseDto } from '@modules/identity/dto/user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository';

@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesRepository: CategoriesRepository) {}

    async createOrUpdateUserCategories(userId: string, categories: string[]): Promise<CategoriesDto> {
        if (!categories || categories.length === 0)
            throw new BadRequestException({
                name: 'EMPTY_CATEGORIES_PASSED',
                title: 'No categories found in request!',
                details: 'No categories or empty array passed to the categories service.',
            });

        const normalizedCategories = normalizeCategories(categories);

        const categoriesDto = await this.categoriesRepository.createOrUpdateUserCategories(
            userId,
            normalizedCategories,
        );

        return plainToInstance(CategoriesDto, categoriesDto);
    }

    async getAllUserCategories(user: UserResponseDto): Promise<CategoriesDto> {
        const { id: userId, name } = user;
        const categories = await this.categoriesRepository.getAllUserCategories(userId);

        if (!categories)
            return {
                id: '',
                categories: [],
                lastUpdated: null,
                user: {
                    id: userId,
                    name,
                },
            };

        return plainToInstance(CategoriesDto, categories);
    }
}
