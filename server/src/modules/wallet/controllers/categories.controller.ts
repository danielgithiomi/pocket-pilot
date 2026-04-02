import { CookiesAuthGuard } from '@common/guards';
import { UserInRequest } from '@common/decorators';
import { VoidResourceResponse } from '@common/types';
import { UserResponseDto } from '@modules/identity/dto/user.dto';
import { CategoriesService } from '../services/categories.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { CategoriesDto, CreateCategoryDto, DeleteCategoryPayload } from '../dto/categories.dto';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(CookiesAuthGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @ApiOperation({ summary: 'Get User Categories', description: 'Get all user categories' })
    @ApiResponse({
        status: 200,
        isArray: false,
        type: CategoriesDto,
        description: 'The categories fetched successfully by User ID',
    })
    async getCategories(@UserInRequest() user: UserResponseDto) {
        return this.categoriesService.getAllUserCategories(user);
    }

    @Post()
    @ApiOperation({ summary: 'Create or Update User Categories', description: 'Create user categories' })
    @ApiResponse({
        status: 201,
        type: CategoriesDto,
        description: 'The categories created or updated successfully by User ID',
    })
    async createCategory(@Body() payload: CreateCategoryDto, @UserInRequest() user: UserResponseDto) {
        return this.categoriesService.createCategory(user.id, payload);
    }

    @Delete()
    @ApiOperation({ summary: 'Delete User Category', description: 'Delete user category' })
    @ApiResponse({
        status: 200,
        type: VoidResourceResponse,
        description: 'The category deleted successfully by User ID',
    })
    async deleteCategory(@Body() payload: DeleteCategoryPayload, @UserInRequest() user: UserResponseDto) {
        await this.categoriesService.deleteCategoryByName(user.id, payload);

        return {
            message: 'Category deleted!',
            details: `Your [${payload.categoryName}] category has been deleted successfully.`,
        };
    }
}
