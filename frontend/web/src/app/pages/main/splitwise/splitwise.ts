import { Button } from '@atoms/button';
import { SplitwiseSquad } from '@global/types';
import { SplitwiseSquads } from './squads/squads';
import { SplitwiseService } from '@api/splitwise.service';
import { SplitwiseSplitForm } from './split-form/split-form';
import { SplitwiseSquardForm } from './squard-form/squard-form';
import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, ListPlus, Users } from 'lucide-angular';

@Component({
  selector: 'app-splitwise',
  styleUrl: './splitwise.css',
  templateUrl: './splitwise.html',
  imports: [Button, LucideAngularModule, SplitwiseSquads, SplitwiseSquardForm, SplitwiseSplitForm],
})
export class Splitwise {
  // ICONS
  protected readonly iconSize = 20;
  protected readonly Users = Users;
  protected readonly Plus = ListPlus;

  // SIGNAL STATES
  protected readonly isAddSplitFormOpen = signal<boolean>(false);
  protected readonly isCreateSquadFormOpen = signal<boolean>(false);

  // SERVICES
  protected readonly splitwiseService = inject(SplitwiseService);

  // DATA
  protected readonly userSquads = this.splitwiseService.getUserSquads();

  // COMPUTED
  protected isLoadingResources = computed<boolean>(() => this.userSquads.isLoading());
  protected squads = computed<SplitwiseSquad[]>(() => this.userSquads.value()?.data || []);
  protected allSquadMembers = computed<string[]>(() =>
    Array.from(new Set(this.squads().flatMap((squad) => squad.squadMembers))),
  );

  // METHODS
  protected handleSplitFormClose(reload: boolean) {
    if (reload) this.userSquads.reload();
    this.isAddSplitFormOpen.set(false);
  }

  protected handleCreateSquadFormClose(reload: boolean) {
    if (reload) this.userSquads.reload();
    this.isCreateSquadFormOpen.set(false);
  }
}
