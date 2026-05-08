import { Button } from '@atoms/button';
import { SplitwiseSquads } from './squads/squads';
import { SplitwiseService } from '@api/splitwise.service';
import { SplitwiseSquardForm } from './squard-form/squard-form';
import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, ListPlus, Users } from 'lucide-angular';

@Component({
  selector: 'app-splitwise',
  styleUrl: './splitwise.css',
  templateUrl: './splitwise.html',
  imports: [Button, LucideAngularModule, SplitwiseSquads, SplitwiseSquardForm],
})
export class Splitwise {
  // ICONS
  protected readonly iconSize = 20;
  protected readonly Users = Users;
  protected readonly Plus = ListPlus;

  // SIGNAL STATES
  protected readonly isCreateSquadFormOpen = signal<boolean>(false);

  // SERVICES
  protected readonly splitwiseService = inject(SplitwiseService);

  // DATA
  protected readonly userSquads = this.splitwiseService.getUserSquads();

  // COMPUTED
  protected isLoadingResources = computed<boolean>(() => false);
  protected allSquadMembers = computed<string[]>(() => {
    const squads = this.userSquads.value()?.data;
    if (!squads) return [];
    return Array.from(new Set(squads.flatMap((squad) => squad.squadMembers)));
  });

  // METHODS
  protected handleCreateSquadFormClose(reload: boolean) {
    if (reload) this.userSquads.reload();
    this.isCreateSquadFormOpen.set(false);
  }
}
