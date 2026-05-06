import { Button } from '@atoms/button';
import { Component, input } from '@angular/core';
import { LucideAngularModule, Users } from 'lucide-angular';

@Component({
  selector: 'splitwise-squads',
  templateUrl: './squads.html',
  imports: [LucideAngularModule, Button],
})
export class SplitwiseSquads {
  // ICONS
  protected readonly iconSize = 20;
  protected readonly Users = Users;

  // INPUTS
  readonly isLoadingResources = input.required<boolean>();

  // COMPUTED
}
