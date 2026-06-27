import { CookiesAuthGuard } from '@common/guards';
import { Summary, UserInRequest } from '@common/decorators';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from '@modules/features/services/comments.service';
import { FeatureCommentPayload, FeatureWithCommentsDto } from '../dto/features.dto';

@UseGuards(CookiesAuthGuard)
@Controller('features/:featureId/comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a comment', description: 'Add a comment to a feature' })
    @ApiParam({ name: 'featureId', description: 'The ID of the feature the comment belongs to' })
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
    ) {
        return this.commentsService.addCommentToFeature(userId, featureId, payload);
    }
}
