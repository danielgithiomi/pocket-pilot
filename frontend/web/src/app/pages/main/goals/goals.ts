import { Button } from '@atoms/button';
import { GoalItem } from './goal-item';
import { GoalsForm } from './goals-form';
import { NgClass } from '@angular/common';
import { GoalsService } from '@api/goals.service';
import { DrawerService } from '@infrastructure/services';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { GoalItemSkeleton } from './goal-item/goal-item.skeleton';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { Component, computed, inject, signal } from '@angular/core';
import { NoData } from '@components/structural/main/no-data/no-data';

@Component({
  selector: 'app-goals',
  styleUrl: './goals.css',
  templateUrl: './goals.html',
  imports: [
    NoData,
    Button,
    NgClass,
    GoalItem,
    GoalsForm,
    CalendarModule,
    GoalItemSkeleton,
    LucideAngularModule,
  ],
})
export class Goals {
  // Icons
  protected readonly iconSize = 16;
  protected readonly PlusIcon = Plus;

  // Services
  protected readonly goalsService = inject(GoalsService);
  protected readonly drawerService = inject(DrawerService);

  // Signals
  protected readonly isGoalsFormOpen = signal<boolean>(false);
  protected readonly isBillsFormOpen = signal<boolean>(false);

  // Data
  protected readonly bills$ = 0;
  protected readonly goals$ = this.goalsService.getUserGoals();

  // Computed
  protected readonly isFetchingGoals = computed(() => this.goals$.isLoading());
}
