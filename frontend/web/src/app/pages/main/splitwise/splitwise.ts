import { Button } from '@atoms/button';
import { SplitwiseSquad } from '@global/types';
import { SplitwiseSquads } from './squads/squads';
import { SplitwiseEvents } from './events/events';
import { SplitwiseService } from '@api/splitwise.service';
import { SplitwiseSplitForm } from './split-form/split-form';
import { SplitwiseSquardForm } from './squard-form/squard-form';
import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, ListPlus, Users } from 'lucide-angular';
import { UpdateSplitwiseSquad } from './squard-form/update-squad/update-squad';

@Component({
    selector: 'app-splitwise',
    styleUrl: './splitwise.css',
    templateUrl: './splitwise.html',
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
export class Splitwise {
    // ICONS
    protected readonly iconSize = 20;
    protected readonly Users = Users;
    protected readonly Plus = ListPlus;

    // SIGNAL STATES
    protected readonly isAddSplitFormOpen = signal<boolean>(false);
    protected readonly isCreateSquadFormOpen = signal<boolean>(false);
    protected readonly isUpdateSquadFormOpen = signal<boolean>(false);
    protected readonly squadToUpdate = signal<SplitwiseSquad | null>(null);

    // SERVICES
    protected readonly splitwiseService = inject(SplitwiseService);

    // DATA
    protected readonly userSquads = this.splitwiseService.getUserSquads();

    // COMPUTED
    protected isLoadingResources = computed<boolean>(() => this.userSquads.isLoading());
    protected hasSquadsError = computed<boolean>(() => !!this.userSquads.error());
    protected squads = computed<SplitwiseSquad[]>(() => {
        if (this.hasSquadsError()) return [];
        return this.userSquads.value()?.data ?? [];
    });
    protected allSquadMembers = computed<string[]>(() =>
        Array.from(new Set(this.squads().flatMap((squad) => squad.squadMembers))),
    );

    // METHODS
    protected handleOnUpdateSquadItemEvent(squadId: string) {
        this.splitwiseService.getSquadById(squadId).subscribe({
            next: (squad) => {
                this.squadToUpdate.set(squad);
                this.isUpdateSquadFormOpen.set(true);
            },
        });
    }

    protected handleSplitFormClose(reload: boolean) {
        if (reload) {
            this.userSquads.reload();
            this.splitwiseService.getUserSplitrEvents().reload();
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
