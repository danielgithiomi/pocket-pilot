import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { SplitrSquad } from '@global/types';
import { SplitrEvents } from './events/events';
import { SplitrSquads } from './squads/squads';
import { SplitrService } from '@api/splitr.service';
import { SplitrSplitForm } from './split-form/split-form';
import { SplitwiseSquardForm } from './squard-form/squard-form';
import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, ListPlus, Users } from 'lucide-angular';
import { DrawerService } from '@infrastructure/services/drawer.service';
import { UpdateSplitrSquad } from './squard-form/update-squad/update-squad';

@Component({
    selector: 'app-splitr',
    styleUrl: './splitr.css',
    templateUrl: './splitr.html',
    imports: [
        Button,
        NgClass,
        SplitrSquads,
        SplitrEvents,
        SplitrSplitForm,
        UpdateSplitrSquad,
        LucideAngularModule,
        SplitwiseSquardForm
    ]
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
    protected readonly drawerService = inject(DrawerService);
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
        Array.from(new Set(this.squads().flatMap(squad => squad.squadMembers)))
    );

    // METHODS
    protected handleOnUpdateSquadItemEvent(squadId: string) {
        this.splitrService.getSquadById(squadId).subscribe({
            next: squad => {
                this.squadToUpdate.set(squad);
                this.isUpdateSquadFormOpen.set(true);
            }
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
