import { Button } from '@atoms/button';
import { SplitrSquad } from '@global/types';
import { SplitwiseSquads } from './squads/squads';
import { SplitwiseEvents } from './events/events';
import { SplitrService } from '@api/splitr.service';
import { SplitwiseSplitForm } from './split-form/split-form';
import { SplitwiseSquardForm } from './squard-form/squard-form';
import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, ListPlus, Users } from 'lucide-angular';
import { UpdateSplitwiseSquad } from './squard-form/update-squad/update-squad';

@Component({
    selector: 'app-splitr',
    styleUrl: './splitr.css',
    templateUrl: './splitr.html',
    imports: [
        Button,
        SplitwiseSquads,
        SplitwiseEvents,
        SplitwiseSplitForm,
        LucideAngularModule,
        SplitwiseSquardForm,
        UpdateSplitwiseSquad,
    ],
})
export class Splitr {
    // ICONS
    protected readonly iconSize = 20;
    protected readonly Users = Users;
    protected readonly Plus = ListPlus;

    // SIGNAL STATES
    protected readonly isAddSplitFormOpen = signal<boolean>(false);
    protected readonly isCreateSquadFormOpen = signal<boolean>(false);
    protected readonly isUpdateSquadFormOpen = signal<boolean>(false);
    protected readonly squadToUpdate = signal<SplitrSquad | null>(null);

    // SERVICES
    protected readonly splitrService = inject(SplitrService);

    // DATA
    protected readonly userSquads = this.splitrService.getUserSquads();

    // COMPUTED
    protected isLoadingResources = computed<boolean>(() => this.userSquads.isLoading());
    protected hasSquadsError = computed<boolean>(() => !!this.userSquads.error());
    protected squads = computed<SplitrSquad[]>(() => {
        if (this.hasSquadsError()) return [];
        return this.userSquads.value()?.data ?? [];
    });
    protected allSquadMembers = computed<string[]>(() =>
        Array.from(new Set(this.squads().flatMap((squad) => squad.squadMembers))),
    );

    // METHODS
    protected handleOnUpdateSquadItemEvent(squadId: string) {
        this.splitrService.getSquadById(squadId).subscribe({
            next: (squad) => {
                this.squadToUpdate.set(squad);
                this.isUpdateSquadFormOpen.set(true);
            },
        });
    }

    protected handleSplitFormClose(reload: boolean) {
        if (reload) {
            this.userSquads.reload();
            this.splitrService.getUserSplitrEvents().reload();
        }
        this.isAddSplitFormOpen.set(false);
    }

    protected handleSquadFormClose(reload: boolean) {
        if (reload) this.userSquads.reload();
        this.isCreateSquadFormOpen.set(false);
        this.isUpdateSquadFormOpen.set(false);
        this.squadToUpdate.set(null);
    }
}
