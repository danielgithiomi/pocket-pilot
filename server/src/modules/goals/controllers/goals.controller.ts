import { CreateGoalDto } from '../dto/goals.dto';
import { CookiesAuthGuard } from '@common/guards';
import { UserInRequest } from '@common/decorators';
import { GoalsService } from '../services/goals.service';
import { type User } from '@modules/identity/dto/user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';

@Controller('goals')
@UseGuards(CookiesAuthGuard)
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) {}

    @Post()
    @HttpCode(201)
    @ApiOperation({ summary: 'Create a new goal' })
    @ApiResponse({ status: 201, type: String, description: 'Goal created successfully' })
    createGoal(@UserInRequest() user: User, @Body() createGoalDto: CreateGoalDto) {
        return this.goalsService.createGoal();
    }
}
