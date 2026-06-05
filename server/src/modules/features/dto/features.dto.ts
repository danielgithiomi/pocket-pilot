import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { FeatureCategory, FeatureStatus, VoteType } from '@prisma/client';

export class FeaturePayload {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'My Feature Title', description: 'The title of the feature' })
    title!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'My Feature Description', description: 'The description of the feature' })
    description!: string;

    @IsNotEmpty()
    @IsEnum(FeatureCategory)
    @ApiProperty({ enum: FeatureCategory, example: FeatureCategory.OTHER, description: 'The category of the feature' })
    category!: FeatureCategory;
}

@Exclude()
export class FeatureVotesDto {
    @Expose()
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The ID of the vote in the table' })
    id!: string;

    @Expose()
    @ApiProperty({ enum: VoteType, example: VoteType.UPVOTE, description: 'The type of the vote' })
    voteType!: VoteType;

    @Expose()
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The ID of the user who voted' })
    voterId!: string;

    @Expose()
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the feature that was voted on',
    })
    featureId!: string;

    @Expose()
    @ApiProperty({ example: '2025-01-01', description: 'The last updated date of the vote' })
    updatedAt!: Date;

    @Expose()
    @ApiProperty({ example: '2025-01-01', description: 'The created date of the vote' })
    createdAt!: Date;
}

@Exclude()
export class FeatureDto {
    @Expose()
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The ID of the feature' })
    id!: string;

    @Expose()
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the user who created the feature',
    })
    authorId!: string;

    @Expose()
    @ApiProperty({ example: 'My Feature Title', description: 'The title of the feature' })
    featureTitle!: string;

    @Expose()
    @ApiProperty({ example: 'My Feature Description', description: 'The description of the feature' })
    featureContent!: string;

    @Expose()
    @ApiProperty({ example: 5, description: 'The score of the feature' })
    featureScore!: number;

    @Expose()
    @ApiProperty({ example: 8, description: 'The upvote count of the feature' })
    upvoteCount!: number;

    @Expose()
    @ApiProperty({ example: 3, description: 'The downvote count of the feature' })
    downvoteCount!: number;

    @Expose()
    @ApiProperty({ enum: FeatureStatus, example: FeatureStatus.NEW, description: 'The status of the feature' })
    featureStatus!: FeatureStatus;

    @Expose()
    @ApiProperty({ enum: FeatureCategory, example: FeatureCategory.OTHER, description: 'The category of the feature' })
    featureCategory!: FeatureCategory;

    @Expose()
    @Type(() => FeatureVotesDto)
    @ApiProperty({ type: FeatureVotesDto, isArray: true, description: 'The votes on the feature' })
    featureVotes!: FeatureVotesDto[];

    @Expose()
    @ApiProperty({ example: '2025-01-01', description: 'The last updated date of the feature' })
    updatedAt!: Date;

    @Expose()
    @ApiProperty({ example: '2025-01-01', description: 'The created date of the feature' })
    createdAt!: Date;
}

@Exclude()
export class FeatureCommentsDto {
    @Expose()
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The ID of the comment in the table' })
    id!: string;

    @Expose()
    @ApiProperty({ example: 'My Comment', description: 'The content of the comment' })
    comment!: string;

    @Expose()
    @ApiProperty({ example: '2025-01-01', description: 'The created date of the comment' })
    createdAt!: Date;
}

@Exclude()
export class FeatureWithCommentsDto extends FeatureDto {
    @Expose()
    @Type(() => FeatureCommentsDto)
    @ApiProperty({ type: FeatureCommentsDto, isArray: true, description: 'The comments on the feature' })
    featureComments!: FeatureCommentsDto[];
}
