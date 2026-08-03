import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { SplitrSquad } from '@shared/types';
import { SplitrService } from '@api/splitr.service';
import { DrawerService } from '@infrastructure/services';
import { NoData } from '@structural/main/no-data/no-data';
import { LucideAngularModule, Users } from 'lucide-angular';
import { FetchError } from '@structural/main/fetch-error/fetch-error';
import { Component, computed, inject, input, output } from '@angular/core';
import { SquadItem } from '@components/structural/main/squad-item/squad-item';

@Component({
    selector: 'splitr-squads',
    templateUrl: './squads.html',
    imports: [LucideAngularModule, NgClass, Button, NoData, FetchError, SquadItem]
})
export class SplitrSquads {
    // ICONS
    protected readonly iconSize = 20;
    protected readonly Users = Users;

    // ANIMATIONS
    protected readonly animationDimensions = '180px';
    protected readonly animationMessageSize = 'text-xs';

    // INPUTS
    readonly isLoadingResources = input.required<boolean>();
    readonly isCreateSquadFormOpen = input.required<boolean>();

    // OUTPUTS
    readonly onUpdateSquadItemEvent = output<string>();
    readonly createSquadButtonClickEvent = output<void>();

    // SERVICES
    private readonly splitrService = inject(SplitrService);
    protected readonly drawerService = inject(DrawerService);

    // DATA
    protected readonly squads = this.splitrService.getUserSquads();

    // COMPUTED
    protected readonly apiError = computed<boolean>(() => !!this.squads.error());
    protected readonly isFetchingSquads = computed<boolean>(() => this.squads.isLoading());
    protected readonly userSquads = computed<SplitrSquad[]>(() => {
        if (this.apiError()) return [];
        return this.squads.value()?.data.slice().reverse() ?? [];
    });
}
