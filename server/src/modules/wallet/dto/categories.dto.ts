import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';

export type FullCategories = Prisma.CategoriesCreateInput;

export type CategoriesWithUser = Prisma.CategoriesGetPayload<{
    omit: { userId: true };
    include: { user: { select: { id: true; name: true } } };
}>;

export class CreateCategoriesDto {
    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ example: ['Food', 'Transportation'], description: 'The categories of the transactions' })
    categories!: string[];
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
        example: ['Food', 'Transportation', 'Utilities'],
        description: 'The categories of the transactions',
    })
    categories!: string[];

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
