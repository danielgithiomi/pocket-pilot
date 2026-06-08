import { Badge, BadgeVariant } from '@atoms/badge';
import { formatDate } from '@libs/utils';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { AuthService } from '@api/auth.service';
import { denormalizeCategoryName } from '@global/utils';
import { FeaturesService } from '@api/features.service';
import { Feature, IVoidResourceResponse } from '@global/types';
import { Component, computed, inject, input, signal } from '@angular/core';
import { LucideAngularModule, ChevronsUp, MessageSquareReply, Trash2 } from 'lucide-angular';
import { FeatureStatusEnum } from '@global/enums';

@Component({
    selector: 'feature-item',
    templateUrl: 'feature-item.html',
    imports: [NgClass, LucideAngularModule, Badge],
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

    // SERVICES
    protected readonly authService = inject(AuthService);
    protected readonly toastService = inject(ToastService);
    protected readonly featuresService = inject(FeaturesService);

    // INPUTS
    readonly id = input.required<string>();
    readonly feature = input.required<Feature>();
    readonly showDeleteIcon = input.required<boolean>();

    // COMPUTED
    protected readonly hasUserUpvoted = computed<boolean>(() => true);
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
            UNDER_REVIEW: 'warning',
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
        console.log('feature clicked', this.feature());
    }

    handleUpvoteClick(event: Event) {
        event.stopPropagation();
        this.isUserUpvoted.set(!this.isUserUpvoted());
    }

    handleOnFeatureDelete() {

        this.isDeleting.set(true);

        this.featuresService.deleteFeatureRequestById(this.feature().id).subscribe({
            next: (response: IVoidResourceResponse) => {
                const { details } = response;
                this.toastService.show({
                    details,
                    variant: 'success',
                    title: 'Feature deleted successfully',
                });

                this.featuresService.refreshAll();
            },
            complete: () => this.isDeleting.set(false),
        });
    }
}
