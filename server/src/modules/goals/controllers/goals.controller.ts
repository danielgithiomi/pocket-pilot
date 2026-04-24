import { CookiesAuthGuard } from '@common/guards';
import { hoursToMilliseconds } from '@libs/utils';
import { GoalsService } from '../services/goals.service';
import { CreateGoalDto, GoalDto } from '../dto/goals.dto';
import { type User } from '@modules/identity/dto/user.dto';
import { Public, Summary, UserInRequest } from '@common/decorators';
import { ExposeEnumDto, VoidResourceResponse } from '@common/types';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';

@Controller('goals')
@UseGuards(CookiesAuthGuard)
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) {}

    @Get('categories')
    @CacheKey('goal:categories')
    @CacheTTL(hoursToMilliseconds(24))
    @UseInterceptors(CacheInterceptor)
    @Public()
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Get all goal categories' })
    @Summary('Goal categories retrieved', 'The user retrieved all goal categories')
    @ApiResponse({
        status: 200,
        isArray: true,
        type: ExposeEnumDto,
        description: 'Goal categories retrieved successfully',
    })
    getGoalCategories() {
        return this.goalsService.getGoalCategories();
    }

    @Get()
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Get all user goals' })
    @Summary('User goals retrieved', 'The user retrieved all their goals')
    @ApiResponse({ status: 200, type: GoalDto, isArray: true, description: 'All user goals retrieved successfully' })
    getGoals(@UserInRequest() user: User) {
        return this.goalsService.getUserGoals(user.id!);
    }

    @Post()
    @HttpCode(201)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Create a new goal' })
    @ApiResponse({ status: 201, type: GoalDto, description: 'Goal created successfully' })
    @Summary('New goal created', 'The user created a new goal and was saved to the database')
    createGoal(@UserInRequest() user: User, @Body() createGoalDto: CreateGoalDto) {
        return this.goalsService.createGoal(user.id!, createGoalDto);
    }

    @Delete(':goalId')
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Delete a goal by ID' })
    @Summary('Goal deleted', 'The user deleted a goal')
    @ApiResponse({ status: 200, type: VoidResourceResponse, description: 'Goal deleted successfully' })
    async deleteGoal(@Param('goalId') goalId: string): Promise<VoidResourceResponse> {
        const deletedGoal = await this.goalsService.deleteGoalById(goalId);

        return {
            message: 'Finance goal deleted!',
            details: `Your [${deletedGoal.name}] goal has been deleted successfuly.`,
        };
    }
}
