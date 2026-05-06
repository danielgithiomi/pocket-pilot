import { Button } from '@atoms/button';
import { Component, computed } from '@angular/core';
import { LucideAngularModule, ListPlus, Users } from 'lucide-angular';
import { SplitwiseSquads } from "./squads/squads";

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

  // COMPUTED
  protected isLoadingResources = computed<boolean>(() => false);
}
