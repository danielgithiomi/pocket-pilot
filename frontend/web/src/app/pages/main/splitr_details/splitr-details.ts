import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ISplitrEvent } from '@global/types';
import { AuthService } from '@api/auth.service';
import { ActivatedRoute } from '@angular/router';
import { SplitrSummary } from './summary/splitr-summary';
import { DrawerService } from '@infrastructure/services';
import { SplitwiseService } from '@api/splitwise.service';
import { NoData } from '@structural/main/no-data/no-data';
import { Breadcrumbs } from '@components/ui/atoms/breadcrumbs';
import { SplitrBreakdown } from './breakdown/splitr-breakdown';
import { Component, computed, inject, signal } from '@angular/core';
import { FetchError } from '@structural/main/fetch-error/fetch-error';
import { LucideAngularModule, CheckCheck, ReceiptText, Trash2 } from 'lucide-angular';

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
    protected readonly SettledIcon = CheckCheck;
    protected readonly BreadcrumbIcon = ReceiptText;

    // ANIMATIONS
    protected readonly animationDimensions = '250px';
    protected readonly animationMessageSize = 'text-sm';

    // STATE SIGNALS
    protected readonly isDeletingSplittable = signal<boolean>(false);
    protected readonly isSettlingSplittable = signal<boolean>(false);

    // SERVICES
    private readonly route = inject(ActivatedRoute);
    private readonly authService = inject(AuthService);
    protected readonly drawerService = inject(DrawerService);
    private readonly splitwiseService = inject(SplitwiseService);

    // DATA
    protected readonly eventId = this.route.snapshot.paramMap.get('eventId') ?? '';
    protected readonly splitrEventResource = this.splitwiseService.getUserSplitrEventById(
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
        { label: 'Events', route: '/splitwise' },
        {
            label: this.splitrEvent()?.eventName ?? '',
            route: `/splitwise/${this.splitrEvent()?.id}`,
        },
    ]);

    // METHODS
    handleOnSplittableSettledClick() {
        //TODO: Implement settled click
    }

    handleOnSplittableDeleteClick() {
        // TODO: Implement delete click
    }
}
