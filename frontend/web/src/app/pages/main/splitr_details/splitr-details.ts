import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { AuthService } from '@api/auth.service';
import { SplitrService } from '@api/splitr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SplitrSummary } from './summary/splitr-summary';
import { DrawerService } from '@infrastructure/services';
import { NoData } from '@structural/main/no-data/no-data';
import { Breadcrumbs } from '@components/ui/atoms/breadcrumbs';
import { SplitrBreakdown } from './breakdown/splitr-breakdown';
import { ISplitrEvent, IVoidResourceResponse } from '@global/types';
import { Component, computed, inject, signal } from '@angular/core';
import { FetchError } from '@structural/main/fetch-error/fetch-error';
import { LucideAngularModule, CheckCheck, ReceiptText, Trash2, Hourglass } from 'lucide-angular';

@Component({
    selector: 'splitr-details',
    templateUrl: './splitr-details.html',
    imports: [
        Button,
        NoData,
        NgClass,
        FetchError,
        Breadcrumbs,
        SplitrSummary,
        SplitrBreakdown,
        LucideAngularModule,
    ],
})
export class SplitrDetails {
    // ICONS
    protected readonly iconSize = 18;
    protected readonly DeleteIcon = Trash2;
    protected readonly PendingIcon = Hourglass;
    protected readonly SettledIcon = CheckCheck;
    protected readonly BreadcrumbIcon = ReceiptText;

    // ANIMATIONS
    protected readonly animationDimensions = '250px';
    protected readonly animationMessageSize = 'text-sm';

    // STATE SIGNALS
    protected readonly isDeletingSplittable = signal<boolean>(false);
    protected readonly isSettlingSplittable = signal<boolean>(false);

    // SERVICES
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly authService = inject(AuthService);
    private readonly toastService = inject(ToastService);
    private readonly splitrService = inject(SplitrService);
    protected readonly drawerService = inject(DrawerService);

    // DATA
    protected readonly eventId = this.route.snapshot.paramMap.get('eventId') ?? '';
    protected readonly splitrEventResource = this.splitrService.getUserSplitrEventById(
        this.eventId,
    );

    // COMPUTED
    protected readonly hasError = computed<boolean>(() => !!this.splitrEventResource.error());
    protected readonly isFetchingDetails = computed<boolean>(() =>
        this.splitrEventResource.isLoading(),
    );
    protected readonly selfName = computed(() => {
        const username = this.authService.user()?.name.split(' ')[0];
        return `${username}(Self)`;
    });
    protected readonly splitrEvent = computed<ISplitrEvent | undefined>(() => {
        if (this.hasError()) return undefined;
        const event = this.splitrEventResource.value()?.data;
        if (!event) return undefined;
        return {
            ...event,
            eventMembers: [...event.eventMembers, this.selfName()],
        };
    });
    protected readonly breadcrumbItems = computed(() => [
        { label: 'Events', route: '/splitr' },
        {
            label: this.splitrEvent()?.eventName ?? '',
            route: `/splitr/${this.splitrEvent()?.id}`,
        },
    ]);

    // UTILITIES
    reloadResources = () => {
        this.splitrEventResource.reload();
        this.splitrService.getUserSplitrEvents().reload();
    };

    // METHODS
    handleOnSplittableSettledClick(isSettled: boolean) {
        this.isSettlingSplittable.set(true);

        setTimeout(() => {
            this.splitrService
                .markSplitrEventAsSettledOrPending(this.eventId, { isSettled: !isSettled })
                .subscribe({
                    next: (response: IVoidResourceResponse) => {
                        const { message, details } = response;
                        this.toastService.show({
                            details,
                            title: message,
                            variant: 'success',
                        });

                        this.reloadResources();
                    },
                    complete: () => this.isSettlingSplittable.set(false),
                });
        }, 2000);
    }

    handleOnSplittableDeleteClick() {
        this.isDeletingSplittable.set(true);

        setTimeout(() => {
            this.splitrService.deleteExistingSplitrEvent(this.eventId).subscribe({
                next: (response: IVoidResourceResponse) => {
                    const { message, details } = response;
                    this.toastService.show({
                        details,
                        title: message,
                        variant: 'success',
                    });

                    this.reloadResources();
                    this.router.navigate(['/splitr'], { replaceUrl: true });
                },
                complete: () => this.isDeletingSplittable.set(false),
            });
        }, 2000);
    }
}
