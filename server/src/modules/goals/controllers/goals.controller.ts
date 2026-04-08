import { ExposeEnumDto } from '@common/types';
import { CookiesAuthGuard } from '@common/guards';
import { GoalsService } from '../services/goals.service';
import { CreateGoalDto, GoalDto } from '../dto/goals.dto';
import { type User } from '@modules/identity/dto/user.dto';
import { Public, UserInRequest } from '@common/decorators';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';

@Controller('goals')
@UseGuards(CookiesAuthGuard)
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) {}

    @Public()
    @Get('categories')
    @ApiOperation({ summary: 'Get all goal categories' })
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
    @ApiOperation({ summary: 'Get all user goals' })
    @ApiResponse({ status: 200, type: GoalDto, isArray: true, description: 'All user goals retrieved successfully' })
    getGoals(@UserInRequest() user: User) {
        return this.goalsService.getUserGoals(user.id!);
    }

    @Post()
    @HttpCode(201)
    @ApiOperation({ summary: 'Create a new goal' })
    @ApiResponse({ status: 201, type: GoalDto, description: 'Goal created successfully' })
    createGoal(@UserInRequest() user: User, @Body() createGoalDto: CreateGoalDto) {
        return this.goalsService.createGoal(user.id!, createGoalDto);
    }
}
