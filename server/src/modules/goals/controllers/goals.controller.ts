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

    @Get()
    @Public()
    @ApiOperation({ summary: 'Get all goal categories' })
    @ApiResponse({ status: 200, type: ExposeEnumDto, isArray: true, description: 'Goal categories retrieved successfully' })
    async getGoalCategories() {
        return await this.goalsService.getGoalCategories();
    }

    @Post()
    @HttpCode(201)
    @ApiOperation({ summary: 'Create a new goal' })
    @ApiResponse({ status: 201, type: GoalDto, description: 'Goal created successfully' })
    async createGoal(@UserInRequest() user: User, @Body() createGoalDto: CreateGoalDto) {
        const createdGoal: GoalDto = await this.goalsService.createGoal(user.id!, createGoalDto);
        return createdGoal;
    }
}
