import { Modal } from '@atoms/modal';
import { NgClass } from '@angular/common';
import { Status } from '@molecules/status';
import { ToastService } from '@atoms/toast';
import { FeatureStatusEnum } from '@global/enums';
import { Badge, BadgeVariant } from '@atoms/badge';
import { FeatureWithComments } from '@global/types';
import { denormalizeCategoryName } from '@global/utils';
import { formatRelativeDate, formatToReadable } from '@libs/utils';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ChevronsUp, LucideAngularModule, MessageSquareText } from 'lucide-angular';
import { COMMENT_AVATAR_COLORS, FEATURE_STATUS_STEPS, resolveFeatureStatusActiveIndex } from './feature-details.types';

@Component({
    selector: 'feature-details',
    styleUrl: './feature-details.css',
    templateUrl: './feature-details.html',
    imports: [Modal, Status, Badge, NgClass, LucideAngularModule]
})
export class FeatureDetails {
    // INPUT
    onBackdropClickClose = input.required<boolean>();
    feature = input.required<FeatureWithComments>();

    // OUTPUTS
    onFeatureModalCloseEvent = output<void>();

    // ICONS
    protected readonly iconSize = 16;
    protected readonly UpVoteIcon = ChevronsUp;
    protected readonly CommentIcon = MessageSquareText;

    // STATE
    protected readonly commentDraft = signal('');

    // SERVICES
    private readonly toastService = inject(ToastService);

    // COMPUTED
    protected readonly featureId = computed<string>(() => `feature-${this.feature().id}`);
    protected readonly statusActiveIndex = computed<number>(() => resolveFeatureStatusActiveIndex(this.feature().featureStatus));
    protected readonly featureComments = computed(() => this.feature().featureComments ?? []);
    protected readonly commentCount = computed<number>(() => this.featureComments().length);
    protected readonly formattedAuthorName = computed<string>(() => {
        const author = this.feature().authorName;
        const [firstName, lastName] = author.split(' ');

        if (!lastName) return firstName;

        const initial = lastName.charAt(0).toUpperCase();
        return `${firstName} ${initial}.`;
    });
    protected readonly formattedSubmittedDate = computed<string>(() => formatRelativeDate(this.feature().createdAt));
    protected readonly formattedStatus = computed<string>(() => formatToReadable(this.feature().featureStatus));
    protected readonly formattedCategory = computed<string>(() => {
        const category = this.feature().featureCategory;
        if (category === 'UI_UX') return 'UI/UX';

        return denormalizeCategoryName(category);
    });
    protected readonly statusBadgeVariant = computed<BadgeVariant>(() => {
        const VARIANT_MAP: Record<FeatureStatusEnum, BadgeVariant> = {
            NEW: 'info',
            REJECTED: 'error',
            SHIPPED: 'success',
            PLANNED: 'success',
            IN_PROGRESS: 'info',
            UNDER_REVIEW: 'warning'
        };

        console.log(this.feature().featureStatus);
        return VARIANT_MAP[this.feature().featureStatus];
    });
    protected readonly statusSteps = computed(() => {
        if (this.feature().featureStatus !== FeatureStatusEnum.REJECTED) {
            return FEATURE_STATUS_STEPS;
        }

        return FEATURE_STATUS_STEPS.map((step, index) => (index === 1 ? { ...step, state: 'error' as const } : step));
    });
    protected readonly canPostComment = computed<boolean>(() => this.commentDraft().trim().length > 0);

    // METHODS
    protected commentAvatarClass(index: number): string {
        return COMMENT_AVATAR_COLORS[index % COMMENT_AVATAR_COLORS.length];
    }

    protected commentInitials(index: number): string {
        return `C${index + 1}`;
    }

    protected commentAuthorLabel(index: number): string {
        return index === 0 ? this.formattedAuthorName() : `Community member ${index + 1}`;
    }

    protected formatCommentDate(date: Date | string): string {
        return formatRelativeDate(date);
    }

    protected handleCommentInput(event: Event) {
        const value = (event.target as HTMLTextAreaElement).value;
        this.commentDraft.set(value);
    }

    protected handlePostComment() {
        if (!this.canPostComment()) return;

        this.toastService.show({
            variant: 'info',
            title: 'Comments coming soon',
            details: 'Posting comments will be available in a future update.'
        });

        this.commentDraft.set('');
    }
}
