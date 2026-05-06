import { Button } from '@atoms/button';
import { SplitwiseSquads } from './squads/squads';
import { Component, computed, signal } from '@angular/core';
import { LucideAngularModule, ListPlus, Users } from 'lucide-angular';

@Component({
  selector: 'app-splitwise',
  styleUrl: './splitwise.css',
  templateUrl: './splitwise.html',
  imports: [Button, LucideAngularModule, SplitwiseSquads],
})
export class Splitwise {
  // ICONS
  protected readonly iconSize = 20;
  protected readonly Users = Users;
  protected readonly Plus = ListPlus;

  // SIGNAL STATES
  protected readonly isSquadFormOpen = signal<boolean>(false);

  // COMPUTED
  protected isLoadingResources = computed<boolean>(() => false);
}
