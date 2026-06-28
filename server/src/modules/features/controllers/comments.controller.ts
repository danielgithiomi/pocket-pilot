import { CookiesAuthGuard } from '@common/guards';
import { Summary, UserInRequest } from '@common/decorators';
import { FeatureWithCommentsDto } from '../dto/features.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { CommentsService } from '@modules/features/services/comments.service';
import { FeatureCommentDto, FeatureCommentPayload } from '../dto/comments.dto';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

@UseGuards(CookiesAuthGuard)
@Controller('features/:featureId/comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a comment', description: 'Add a comment to a feature.' })
    @ApiParam({ name: 'featureId', description: 'The ID of the feature the comment belongs to.' })
    @Summary('Comment created and added to feature.', 'The user created a new comment and added it to a feature.')
    @ApiResponse({
        status: 201,
        isArray: false,
        type: FeatureWithCommentsDto,
        description: 'The comment was created successfully'
    })
    addCommentToFeature(
        @UserInRequest() { id: userId }: User,
        @Body() payload: FeatureCommentPayload,
        @Param('featureId') featureId: string
    ): Promise<FeatureCommentDto> {
        return this.commentsService.addCommentToFeature(userId, featureId, payload);
    }

    @Get()
    @ApiParam({ name: 'featureId', description: 'The ID of the feature to get the comments for.' })
    @ApiOperation({ summary: 'Get all comments for a feature.', description: 'Get all comments for a feature.' })
    @Summary('Get all the feature comments.', 'Get all the the comments associated with the feature request.')
    @ApiResponse({
        status: 200,
        isArray: true,
        type: FeatureCommentDto,
        description: "All the feature's comments were retrieved successfully."
    })
    getAllFeatureComments(
        @UserInRequest() { id: userId }: User,
        @Param('featureId') featureId: string
    ): Promise<FeatureCommentDto[]> {
        return this.commentsService.getAllFeatureComments(userId, featureId);
    }

}
