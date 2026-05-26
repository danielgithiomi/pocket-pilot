import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NoData } from '@structural/main/no-data/no-data';
import { DrawerService } from '@infrastructure/services';
import { SplitwiseService } from '@api/splitwise.service';
import { Component, computed, inject } from '@angular/core';
import { Breadcrumbs } from '@components/ui/atoms/breadcrumbs';
import { FetchError } from '@structural/main/fetch-error/fetch-error';
import { LucideAngularModule, CheckCheck, ReceiptText } from 'lucide-angular';

@Component({
    selector: 'splitr-details',
    templateUrl: './splitr-details.html',
    imports: [LucideAngularModule, NgClass, Button, Breadcrumbs, FetchError, NoData],
})
export class SplitrDetails {
    // ICONS
    protected readonly iconSize = 18;
    protected readonly SettledIcon = CheckCheck;
    protected readonly BreadcrumbIcon = ReceiptText;

    // SERVICES
    private readonly route = inject(ActivatedRoute);
    protected readonly drawerService = inject(DrawerService);
    private readonly splitwiseService = inject(SplitwiseService);

    // DATA
    protected readonly eventId = this.route.snapshot.paramMap.get('eventId') ?? '';
    protected readonly splitrEventResource = this.splitwiseService.getUserSplitrEventById(this.eventId);

    // COMPUTED
    protected readonly hasError = computed<boolean>(() => !!this.splitrEventResource.error());
    protected readonly isFetchingDetails = computed<boolean>(() => this.splitrEventResource.isLoading());
    protected readonly splitrEvent = computed(() => {
        if (this.hasError()) return undefined;
        return this.splitrEventResource.value()?.data;
    });

    // COMPUTED
    protected readonly breadcrumbItems = computed(() => {
        return [
            { label: 'Events', route: '/splitwise' },
            {
                label: this.splitrEvent()?.eventName ?? '',
                route: `/splitwise/${this.splitrEvent()?.id}`,
            },
        ];
    });

    // METHODS
    handleOnSplittableSettledClick() {
        //TODO: Implement settled click
    }

    handleOnSplittableDeleteClick() {
        // TODO: Implement delete click
    }
}
