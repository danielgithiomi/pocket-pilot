import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { NoData } from '@structural/main/no-data/no-data';
import { LucideAngularModule, Users } from 'lucide-angular';
import { Component, computed, input, output } from '@angular/core';
import { FetchError } from '@structural/main/fetch-error/fetch-error';

@Component({
  selector: 'splitwise-squads',
  templateUrl: './squads.html',
  imports: [LucideAngularModule, NgClass, Button, NoData, FetchError],
})
export class SplitwiseSquads {
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
  protected readonly createSquadButtonClickEvent = output<void>();

  // COMPUTED
  protected readonly isFetchingSquads = computed<boolean>(() => false);
}
