import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';

// PAYLOAD
export class FeatureCommentPayload {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'My Comment', description: 'The content of the comment' })
    comment!: string;
}

// PRISMA
export type PrismaComment = Prisma.FeatureCommentsGetPayload<{
    include: {
        author: { select: { name: true; profilePictureKey: true } };
    };
}>;

// DTOs
@Exclude()
export class FeatureCommentDto {
    @Expose()
    @ApiProperty({ example: randomUUID(), description: 'The ID of the comment in the table' })
    id!: string;

    @Expose()
    @ApiProperty({ example: 'My Comment', description: 'The content of the comment' })
    comment!: string;

    @Expose()
    @ApiProperty({ example: randomUUID(), description: 'The ID of the feature that this comment is associated with.' })
    featureId!: string;

    @Expose()
    @ApiProperty({ example: 'John Doe', description: 'The name of the user who created the comment' })
    authorName!: string;

    @Expose()
    @ApiProperty({
        example: 'https://pocket-pilot/profile-picture',
        description: 'The URL of the profile picture of the user who created the comment'
    })
    authorProfilePictureUrl!: string | null;

    @Expose()
    @Type(() => Date)
    @ApiProperty({ example: '2025-01-01', description: 'The created date of the comment' })
    createdAt!: Date;
}
