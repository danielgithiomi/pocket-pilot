import { Button } from '@atoms/button';
import { SplitwiseSquads } from './squads/squads';
import { Component, computed, signal } from '@angular/core';
import { SplitwiseSquardForm } from "./squard-form/squard-form";
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

  // COMPUTED
  protected isLoadingResources = computed<boolean>(() => false);
}
