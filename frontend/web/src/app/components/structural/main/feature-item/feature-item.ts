import { formatDate } from '@libs/utils';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { AuthService } from '@api/auth.service';
import { Badge, BadgeVariant } from '@atoms/badge';
import { denormalizeCategoryName } from '@global/utils';
import { FeaturesService } from '@api/features.service';
import { Feature, IVoidResourceResponse } from '@global/types';
import { FeatureStatusEnum } from '@global/enums';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ChevronsUp, LucideAngularModule, MessageSquareReply, Trash2 } from 'lucide-angular';

@Component({
    selector: 'feature-item',
    templateUrl: 'feature-item.html',
    imports: [NgClass, LucideAngularModule, Badge]
})
export class FeatureItem {
    // ICONS
    protected readonly iconSize = 15;
    protected readonly DeleteIcon = Trash2;
    protected readonly UpVoteIcon = ChevronsUp;
    protected readonly CommentIcon = MessageSquareReply;

    // SIGNAL STATES
    protected readonly isDeleting = signal<boolean>(false);
    protected readonly isVotingOnFeature = signal<boolean>(false);
    private readonly optimisticFeatureScore = signal<number | null>(null);
    private readonly optimisticIsUserUpvoted = signal<boolean | null>(null);

    // SERVICES
    protected readonly authService = inject(AuthService);
    protected readonly toastService = inject(ToastService);
    protected readonly featuresService = inject(FeaturesService);

    // INPUTS
    readonly id = input.required<string>();
    readonly feature = input.required<Feature>();
    readonly showDeleteIcon = input.required<boolean>();

    // OUTPUTS
    onFeatureItemClick = output<string>();

    // COMPUTED
    protected readonly isOwnedByCurrentUser = computed<boolean>(() => {
        const userId = this.authService.user()?.id;
        return this.feature().authorId === userId;
    });
    protected readonly isUserUpvoted = computed<boolean>(() => {
        const optimisticState = this.optimisticIsUserUpvoted();
        if (optimisticState !== null) return optimisticState;

        const userId = this.authService.user()?.id;
        if (!userId) return false;

        return this.feature().featureVotes.some(vote => vote.userId === userId);
    });
    protected readonly displayedFeatureScore = computed<number>(
        () => this.optimisticFeatureScore() ?? this.feature().featureScore
    );
    protected readonly featureId = computed<string>(() => `feature-item-${this.id()}`);
    protected readonly formattedDate = computed<string>(() => {
        const date = this.feature().createdAt.toString();
        return formatDate(date);
    });
    protected readonly formattedCategory = computed<string>(() => {
        const category = this.feature().featureCategory;
        if (category === 'UI_UX') return 'UI/UX';
        return denormalizeCategoryName(category);
    });
    protected readonly featureItemBadgeVariant = computed<BadgeVariant>(() => {
        const VARIANT_MAP: Record<FeatureStatusEnum, BadgeVariant> = {
            NEW: 'info',
            REJECTED: 'error',
            SHIPPED: 'success',
            PLANNED: 'success',
            IN_PROGRESS: 'info',
            UNDER_REVIEW: 'warning'
        };

        return VARIANT_MAP[this.feature().featureStatus];
    });
    protected readonly formattedAuthorName = computed<string>(() => {
        const author = this.feature().authorName;
        const [firstName, lastName] = author.split(' ');

        const initial = lastName.charAt(0).toUpperCase();

        return `${firstName} ${initial}.`;
    });

    // METHODS
    handleFeatureClick() {
        this.onFeatureItemClick.emit(this.feature().id);
    }

    handleUpvoteClick(event: Event) {
        event.stopPropagation();

        // Prevent multiple calls
        if (this.isVotingOnFeature()) return;

        this.isVotingOnFeature.set(true);
        const previousState = this.isUserUpvoted();
        const previousScore = this.displayedFeatureScore();
        const nextState = !previousState;

        this.optimisticIsUserUpvoted.set(nextState);
        this.optimisticFeatureScore.set(previousScore + (nextState ? 1 : -1));

        this.featuresService.toggleFeatureUpvoteById(this.feature().id).subscribe({
            next: (response: Feature) => {
                const userId = this.authService.user()?.id;
                const isUserUpvoted = !!userId && response.featureVotes.some(vote => vote.userId === userId);

                this.optimisticIsUserUpvoted.set(isUserUpvoted);
                this.optimisticFeatureScore.set(response.featureScore);

                this.toastService.show({
                    variant: 'success',
                    title: nextState ? 'Feature upvoted!' : 'Feature upvote removed!',
                    details: nextState
                        ? `You now support [${response.featureTitle}].`
                        : `You no longer support [${response.featureTitle}].`
                });

                this.featuresService.refreshFeatureRequests();
                this.featuresService.refreshUserFeatureRequests();
            },
            error: () => {
                this.toastService.show({
                    variant: 'error',
                    title: 'Something went wrong!',
                    details: 'There was an unexpected error while updating your feature upvote.'
                });

                this.optimisticIsUserUpvoted.set(previousState);
                this.optimisticFeatureScore.set(previousScore);
            },
            complete: () => this.isVotingOnFeature.set(false)
        });
    }

    handleOnFeatureDelete() {
        this.isDeleting.set(true);

        this.featuresService.deleteFeatureRequestById(this.feature().id).subscribe({
            next: (response: IVoidResourceResponse) => {
                const { details } = response;
                this.toastService.show({
                    details,
                    variant: 'success',
                    title: 'Feature deleted successfully'
                });

                this.featuresService.refreshAll();
            },
            complete: () => this.isDeleting.set(false)
        });
    }
}
