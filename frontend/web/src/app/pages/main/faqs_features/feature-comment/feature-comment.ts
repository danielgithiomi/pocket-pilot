import { Avatar } from '@atoms/avatar/avatar';
import { formatRelativeDate } from '@libs/utils';
import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FeatureComment as IFeatureComment } from '@shared/types';

@Component({
    selector: 'feature-comment',
    templateUrl: './feature-comment.html',
    imports: [Avatar, NgOptimizedImage]
})
export class FeatureComment {
    // INPUTS
    featureComment = input.required<IFeatureComment>();

    // COMPUTED
    protected authorName = computed<string>(() => this.featureComment().authorName);
    protected featureCommentId = computed<string>(() => `feature-comment-${this.featureComment().id}`);
    protected commentCreationDate = computed<string>(() => formatRelativeDate(this.featureComment().createdAt));
    protected authorProfilePictureUrl = computed<string | null>(() => {
        const comment = this.featureComment();
        return comment.authorProfilePictureThumbnailUrl ?? comment.authorProfilePictureUrl ?? null;
    });
}
