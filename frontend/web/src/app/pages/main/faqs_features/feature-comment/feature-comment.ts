import { Avatar } from '@atoms/avatar/avatar';
import { Component, computed, input } from '@angular/core';
import { FeatureComment as IFeatureComment } from '@global/types';

@Component({
    imports: [Avatar],
    selector: 'feature-comment',
    templateUrl: './feature-comment.html',
})
export class FeatureComment {

    // INPUTS
    featureComment = input.required<IFeatureComment>();

    // COMPUTED
    protected featureCommentId = computed<string>(() => `feature-comment-${this.featureComment().id}`);

}
