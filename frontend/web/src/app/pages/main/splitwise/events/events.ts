import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { ISplitrEvent } from '@global/types';
import { NoData } from '@structural/main/no-data/no-data';
import { SplitwiseService } from '@api/splitwise.service';
import { Component, computed, inject } from '@angular/core';
import { FetchError } from '@structural/main/fetch-error/fetch-error';
import { SplitrEventItem } from '@structural/main/splitr-event-item/splitr-event-item';

@Component({
    selector: 'splitwise-events',
    templateUrl: './events.html',
    imports: [NgClass, FetchError, NoData, SplitrEventItem],
})
export class SplitwiseEvents {
    // ANIMATIONS
    protected readonly animationDimensions = '180px';
    protected readonly animationMessageSize = 'text-xs';

    // SERVICES
    private readonly router = inject(Router);
    private readonly splitwiseService = inject(SplitwiseService);

    // DATA
    protected readonly splitrEventsResource = this.splitwiseService.getUserSplitrEvents();

    // COMPUTED
    protected readonly hasError = computed<boolean>(() => !!this.splitrEventsResource.error());
    protected readonly isFetchingEvents = computed<boolean>(() =>
        this.splitrEventsResource.isLoading(),
    );
    protected readonly splitrEvents = computed<ISplitrEvent[]>(() => {
        if (this.hasError()) return [];
        return this.splitrEventsResource.value()?.data ?? [];
    });

    // METHODS
    handleOnSplitrEventClick(eventId: string) {
        this.router.navigate(['/splitwise', eventId], { replaceUrl: false });
    }
}
