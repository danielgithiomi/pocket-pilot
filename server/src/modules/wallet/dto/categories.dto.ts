import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { CategoryType, Prisma } from '@prisma/client';

export type FullCategories = Prisma.CategoriesCreateInput;

export type CategoriesWithUser = Prisma.CategoriesGetPayload<{
    omit: { userId: true };
    include: { user: { select: { id: true; name: true } } };
}>;

export class CreateCategoryDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'Salary', description: 'The name of the category' })
    categoryName!: string;

    @IsNotEmpty()
    @ApiProperty({ enum: CategoryType, example: 'INCOME', description: 'The type of the category' })
    categoryType!: CategoryType;
}

export class DeleteCategoryPayload {
    @IsNotEmpty()
    @ApiProperty({ example: 'salary', description: 'The normalized name of the category to delete' })
    categoryName!: string;

    @IsNotEmpty()
    @ApiProperty({ enum: CategoryType, example: 'INCOME', description: 'The type of the category to delete' })
    categoryType!: CategoryType;
}

@Exclude()
export class UserMetaData {
    @Expose()
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The unique ID of the user',
    })
    id!: string;

    @Expose()
    @ApiProperty({
        example: 'John Doe',
        description: 'The name of the user',
    })
    name!: string;
}

@Exclude()
export class CategoriesDto {
    @Expose()
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The unique ID of the category created',
    })
    id!: string;

    @Expose()
    @ApiProperty({
        isArray: true,
        type: [String],
        example: ['Salary', 'Refunds', 'Investments'],
        description: 'The income categories of the transactions',
    })
    incomes!: string[];

    @Expose()
    @ApiProperty({
        isArray: true,
        type: [String],
        example: ['Food', 'Transportation', 'Entertainment'],
        description: 'The expense categories of the transactions',
    })
    expenses!: string[];

    @Expose()
    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'The date the user created the category list',
    })
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'The last updated date the category list was modified',
    })
    lastUpdated!: Date | null;

    @Expose()
    @ApiProperty({
        type: UserMetaData,
        description: 'The user metadata attached to each of the categories',
    })
    user!: UserMetaData;
}
