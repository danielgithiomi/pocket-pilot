import { Badge } from '@atoms/badge';
import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, ChevronsUp, MessageSquareReply } from 'lucide-angular';

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

    // COMPUTED
    protected readonly featureId = computed<string>(() => `feature-item-${this.id()}`);
}
