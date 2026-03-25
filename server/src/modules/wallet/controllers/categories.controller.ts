import { CookiesAuthGuard } from '@common/guards';
import { UserInRequest } from '@common/decorators';
import { CategoriesDto, CreateCategoriesDto } from '../dto/categories.dto';
import { UserResponseDto } from '@modules/identity/dto/user.dto';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @UseGuards(CookiesAuthGuard)
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
    @UseGuards(CookiesAuthGuard)
    @ApiOperation({ summary: 'Create or Update User Categories', description: 'Create user categories' })
    @ApiResponse({
        status: 201,
        type: CategoriesDto,
        description: 'The categories created or updated successfully by User ID',
    })
    async createCategories(@Body() payload: CreateCategoriesDto, @UserInRequest() user: UserResponseDto) {
        const { categories } = payload;
        return this.categoriesService.createOrUpdateUserCategories(user.id, categories);
    }
}
