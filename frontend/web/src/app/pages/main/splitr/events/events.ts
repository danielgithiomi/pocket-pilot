import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { ISplitrEvent } from '@global/types';
import { SplitrService } from '@api/splitr.service';
import { NoData } from '@structural/main/no-data/no-data';
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
    private readonly splitrService = inject(SplitrService);

    // DATA
    protected readonly splitrEventsResource = this.splitrService.getUserSplitrEvents();

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
        this.router.navigate(['/splitr', eventId], { replaceUrl: false });
    }
}
