import { Badge } from '@atoms/badge';
import { Feature } from '@global/types';
import { formatDate } from '@libs/utils';
import { Component, computed, effect, input } from '@angular/core';
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
    readonly feature = input.required<Feature>();

    // COMPUTED
    protected readonly featureId = computed<string>(() => `feature-item-${this.id()}`);
    protected readonly formattedDate = computed<string>(() => {
        const date = this.feature().createdAt.toString();
        console.log('date', date);
        return formatDate(date);
    });
    protected readonly formattedAuthorName = computed<string>(() => {
        return this.feature().authorId.slice(0, 6);
        // const author = this.feature().authorId;
        // const [firstName, lastName] = author.split(' ');

        // const initial = lastName.charAt(0).toUpperCase();

        // return `${firstName} ${initial}.`;
    });

    private readonly effectTest = effect(() => {
        const feature = this.feature();
        console.log(feature);
    });
}
