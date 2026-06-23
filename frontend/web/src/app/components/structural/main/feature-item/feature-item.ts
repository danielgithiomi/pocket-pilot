import { formatDate } from '@libs/utils';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { AuthService } from '@api/auth.service';
import { Badge, BadgeVariant } from '@atoms/badge';
import { denormalizeCategoryName } from '@global/utils';
import { FeaturesService } from '@api/features.service';
import { Feature, IVoidResourceResponse } from '@global/types';
import { FeatureStatusEnum, VoteVariantEnum } from '@global/enums';
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
    protected readonly isUserUpvoted = signal<boolean>(false);
    protected readonly isVotingOnFeature = signal<boolean>(false);

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

        // Temporary State
        this.isUserUpvoted.set(!previousState);

        // Api Call
        const newState = this.isUserUpvoted() ? VoteVariantEnum.DOWNVOTE : VoteVariantEnum.UPVOTE;
        setTimeout(() => {
            this.featuresService.voteOnFeatureById(this.feature().id, newState).subscribe({
                next: (response: Feature) => {
                    this.toastService.show({
                        variant: 'success',
                        title: `Your [${newState}] has been recorded!`,
                        details: `We have marked the [${response.featureTitle}] feature request as [${newState}].`
                    });
                    this.isVotingOnFeature.set(false);
                },
                error: () => {
                    // Revert state to previous
                    this.toastService.show({
                        variant: 'error',
                        title: 'Something went wrong!',
                        details: `There was an unexpected error while trying to [${newState}] the feature request.`
                    });

                    this.isUserUpvoted.set(previousState);
                    this.isVotingOnFeature.set(false);
                },
                complete: () => this.isVotingOnFeature.set(false)
            });
        }, 2000);
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
