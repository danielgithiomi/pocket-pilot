import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GoalCategory, GoalStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

// INPUTS
export class CreateGoalDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'My Goal', description: 'The name of the goal' })
    name!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'My Goal Description', description: 'The description of the goal' })
    description!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'USD', description: 'The currency of the goal' })
    currency!: string;

    @IsNotEmpty()
    @Type(() => Date)
    @ApiProperty({ example: '2025-01-01', description: 'The start date of the goal' })
    startDate!: Date;

    @IsNotEmpty()
    @Type(() => Date)
    @ApiProperty({ example: '2025-12-31', description: 'The end date of the goal' })
    endDate!: Date;

    @IsNotEmpty()
    @IsEnum(GoalCategory)
    @ApiProperty({ enum: GoalCategory, example: GoalCategory.TRAVEL, description: 'The category of the goal' })
    category!: GoalCategory;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 1000, description: 'The monthly contribution to the goal' })
    monthlyContribution!: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 10000, description: 'The target amount for the goal' })
    targetAmount!: number;
}

// OUTPUTS
@Expose()
export class GoalDto {
    @Expose()
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The ID of the goal' })
    id!: string;

    @Expose()
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The ID of the user' })
    userId!: string;

    @Expose()
    @ApiProperty({ example: 'My Goal', description: 'The name of the goal' })
    name!: string;

    @Expose()
    @ApiProperty({ example: 'My Goal Description', description: 'The description of the goal' })
    description!: string;

    @Expose()
    @ApiProperty({ example: 'USD', description: 'The currency of the goal' })
    currency!: string;

    @Expose()
    @ApiProperty({ example: '2025-01-01', description: 'The start date of the goal' })
    startDate!: Date;

    @Expose()
    @ApiProperty({ example: '2025-12-31', description: 'The end date of the goal' })
    endDate!: Date;

    @Expose()
    @ApiProperty({ enum: GoalCategory, description: 'The category of the goal' })
    category!: GoalCategory;

    @Expose()
    @ApiProperty({ enum: GoalStatus, description: 'The status of the goal' })
    status!: GoalStatus;

    @Expose()
    @ApiProperty({ example: 1000, description: 'The monthly contribution to the goal' })
    monthlyContribution!: number;

    @Expose()
    @ApiProperty({ example: 10000, description: 'The target amount for the goal' })
    targetAmount!: number;

    @Expose()
    @ApiProperty({ example: 5000, description: 'The current amount saved towards the goal' })
    currentAmount!: number;

    @Expose()
    @ApiProperty({ example: '2025-01-01', description: 'The last updated date of the goal' })
    updatedAt!: Date;

    @Expose()
    @ApiProperty({ example: '2025-01-01', description: 'The created date of the goal' })
    createdAt!: Date;
}
