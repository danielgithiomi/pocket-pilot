import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { SplitwiseSquad } from '@global/types';
import { NoData } from '@structural/main/no-data/no-data';
import { SplitwiseService } from '@api/splitwise.service';
import { LucideAngularModule, Users } from 'lucide-angular';
import { FetchError } from '@structural/main/fetch-error/fetch-error';
import { Component, computed, inject, input, output } from '@angular/core';
import { SquadItem } from "@components/structural/main/squad-item/squad-item";

@Component({
  selector: 'splitwise-squads',
  templateUrl: './squads.html',
  imports: [LucideAngularModule, NgClass, Button, NoData, FetchError, SquadItem],
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

  // SERVICES
  private readonly splitwiseService = inject(SplitwiseService);

  // DATA
  protected readonly squads = this.splitwiseService.getUserSquads();

  // COMPUTED
  protected readonly apiError = computed<boolean>(() => !!this.squads.error());
  protected readonly isFetchingSquads = computed<boolean>(() => this.squads.isLoading());
  protected readonly userSquads = computed<SplitwiseSquad[]>(() => this.squads.value()?.data || []);
}
