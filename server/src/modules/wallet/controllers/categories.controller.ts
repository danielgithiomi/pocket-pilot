import { CookiesAuthGuard } from '@common/guards';
import { UserInRequest } from '@common/decorators';
import { UserResponseDto } from '@modules/identity/dto/user.dto';
import { CategoriesService } from '../services/categories.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoriesDto, CreateCategoryDto } from '../dto/categories.dto';

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
    async createCategory(@Body() payload: CreateCategoryDto, @UserInRequest() user: UserResponseDto) {
        return this.categoriesService.createCategory(user.id, payload);
    }
}
