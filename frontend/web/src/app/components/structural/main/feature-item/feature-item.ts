import { Badge } from '@atoms/badge';
import { Feature } from '@global/types';
import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, ChevronsUp, MessageSquareReply } from 'lucide-angular';
import { formatFullDate } from '@libs/utils';

@Component({
    selector: 'feature-item',
    templateUrl: 'feature-item.html',
    imports: [LucideAngularModule, Badge],
})
export class FeatureItem {
    // ICONS
    protected readonly iconSize = 15;
    protected readonly UpVoteIcon = ChevronsUp;
    protected readonly CommentIcon = MessageSquareReply;

    // INPUTS
    readonly id = input.required<string>();
    readonly feature = input.required<Feature>();

    // COMPUTED
    protected readonly featureId = computed<string>(() => `feature-item-${this.id()}`);
    protected readonly formattedDate = computed<string>(() => {
        const date = this.feature().createdAt.toISOString();
        return formatFullDate(date);
    });
}
