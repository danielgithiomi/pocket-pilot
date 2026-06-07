import { Badge } from '@atoms/badge';
import { Feature } from '@global/types';
import { formatDate } from '@libs/utils';
import { NgClass } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { LucideAngularModule, ChevronsUp, MessageSquareReply } from 'lucide-angular';

@Component({
    selector: 'feature-item',
    templateUrl: 'feature-item.html',
    imports: [NgClass, LucideAngularModule, Badge],
})
export class FeatureItem {
    // ICONS
    protected readonly iconSize = 15;
    protected readonly UpVoteIcon = ChevronsUp;
    protected readonly CommentIcon = MessageSquareReply;

    // SIGNAL STATES
    protected readonly isUserUpvoted = signal<boolean>(false);

    // INPUTS
    readonly id = input.required<string>();
    readonly feature = input.required<Feature>();

    // COMPUTED
    protected readonly hasUserUpvoted = computed<boolean>(() => true);
    protected readonly featureId = computed<string>(() => `feature-item-${this.id()}`);
    protected readonly formattedDate = computed<string>(() => {
        const date = this.feature().createdAt.toString();
        return formatDate(date);
    });
    protected readonly formattedAuthorName = computed<string>(() => {
        const author = this.feature().authorName;
        const [firstName, lastName] = author.split(' ');

        const initial = lastName.charAt(0).toUpperCase();

        return `${firstName} ${initial}.`;
    });

    // METHODS
    handleFeatureClick() {
        console.log('feature clicked', this.feature());
    }

    handleUpvoteClick(event: Event) {
        event.stopPropagation();
        this.isUserUpvoted.set(!this.isUserUpvoted());
    }
}
