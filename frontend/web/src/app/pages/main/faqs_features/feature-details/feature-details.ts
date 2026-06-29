import { Modal } from '@atoms/modal';
import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { Status } from '@molecules/status';
import { ToastService } from '@atoms/toast';
import { AuthService } from '@api/auth.service';
import { FeatureStatusEnum } from '@global/enums';
import { Badge, BadgeVariant } from '@atoms/badge';
import { FeatureComment } from '../feature-comment';
import { denormalizeCategoryName } from '@global/utils';
import { FeaturesService } from '@api/features.service';
import { formatRelativeDate, formatToReadable } from '@libs/utils';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ChevronsUp, LucideAngularModule, MessageSquareText, Send } from 'lucide-angular';
import { FEATURE_STATUS_STEPS, resolveFeatureStatusActiveIndex } from './feature-details.types';
import { FeatureWithComments, FeatureCommentPayload, FeatureComment as IFeatureComment } from '@global/types';

@Component({
    selector: 'feature-details',
    styleUrl: './feature-details.css',
    templateUrl: './feature-details.html',
    imports: [NgClass, Modal, Status, Badge, LucideAngularModule, Button, FeatureComment]
})
export class FeatureDetails {
    // INPUT
    featureId = input.required<string>();
    onBackdropClickClose = input.required<boolean>();
    feature = input.required<FeatureWithComments>();

    // OUTPUTS
    onFeatureModalCloseEvent = output<void>();

    // ICONS
    protected readonly iconSize = 16;
    protected readonly SendIcon = Send;
    protected readonly UpVoteIcon = ChevronsUp;
    protected readonly CommentIcon = MessageSquareText;

    // STATE
    protected readonly commentDraft = signal('');
    protected readonly isPostingComment = signal<boolean>(false);
    protected readonly optimisticComments = signal<IFeatureComment[]>([]);

    // SERVICES
    private readonly authService = inject(AuthService);
    private readonly toastService = inject(ToastService);
    private readonly featuresService = inject(FeaturesService);

    // DATA
    protected readonly commentsResource = this.featuresService.getCommentsAssociatedWithFeature(this.featureId);

    // COMPUTED
    protected readonly isLoadingComments = computed<boolean>(() => this.commentsResource.isLoading());
    protected readonly compositeFeatureId = computed<string>(() => `feature-${this.feature().id}`);
    protected readonly statusActiveIndex = computed<number>(() =>
        resolveFeatureStatusActiveIndex(this.feature().featureStatus)
    );
    protected readonly featureComments = computed<IFeatureComment[]>(() => {
        const featureComments: IFeatureComment[] | undefined = this.commentsResource.value()?.data;
        const apiComments = featureComments ?? [];

        return [...this.optimisticComments(), ...apiComments];
    });
    protected readonly commentCount = computed<number>(() => this.featureComments().length);
    protected readonly formattedAuthorName = computed<string>(() => {
        const author: string = this.feature().authorName;
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
    protected handleCommentInput(event: Event) {
        const value = (event.target as HTMLTextAreaElement).value;
        this.commentDraft.set(value);
    }

    protected handlePostComment() {
        if (!this.canPostComment()) return;

        console.log('Optimistic Updates');
        const optimisticComment: IFeatureComment = {
            id: crypto.randomUUID(),
            featureId: this.feature().id,
            comment: this.commentDraft(),
            createdAt: new Date(Date.now()),
            authorName: this.authService.user()!.name,
            authorProfilePictureUrl: this.authService.user()?.profilePictureUrl
        };

        this.optimisticComments.update(comments => [optimisticComment, ...comments]);

        console.log('Posting comment:', this.commentDraft());

        this.isPostingComment.set(true);

        const payload: FeatureCommentPayload = {
            comment: this.commentDraft()
        };

        this.featuresService.addCommentToFeature(this.feature().id, payload).subscribe({
            next: (response: IFeatureComment) => {
                console.log('response', response);

                this.toastService.show({
                    variant: 'success',
                    title: 'Comment was added!',
                    details: 'Your comment has been added to the feature request successfully.'
                });

                console.log('Before removal', this.optimisticComments());

                // Find the optimistic updates
                const filteredComments = this.optimisticComments().filter(
                    comment => comment.id !== optimisticComment.id
                );

                this.optimisticComments.set(filteredComments);

                console.log('After removal', this.optimisticComments());

                console.log('Reloading details');
                this.featuresService.refreshAll();
                this.commentsResource.reload();
            },
            error: (error: Error) => {
                console.error('Error posting comment:', error);

                this.toastService.show({
                    variant: 'error',
                    details: error.message,
                    title: 'Error posting your comment!'
                });

                // Remove comment from optimistic comments
                setTimeout(() => {
                    const updatedList = this.optimisticComments().filter(
                        comment => comment.id !== optimisticComment.id
                    );
                    this.optimisticComments.set(updatedList);
                }, 2000);
            },
            complete: () => {
                this.commentDraft.set('');
                this.isPostingComment.set(false);
            }
        });
    }
}
