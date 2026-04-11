import { Button } from '@atoms/button';
import { GoalItem } from './goal-item';
import { GoalsForm } from './goals-form';
import { BillsForm } from './bills-form';
import { NgClass } from '@angular/common';
import { GoalsService } from '@api/goals.service';
import { BillsService } from '@api/bills.service';
import { DrawerService } from '@infrastructure/services';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { GoalItemSkeleton } from './goal-item/goal-item.skeleton';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { Component, computed, inject, signal } from '@angular/core';
import { NoData } from '@components/structural/main/no-data/no-data';
import { BillItem } from "./bill-item";
import { BillItemSkeleton } from "./bill-item/bill-item.skeleton";
import { FetchError } from "@components/structural/main/fetch-error/fetch-error";
import { AccountsService } from '@api/accounts.service';

@Component({
  selector: 'app-goals',
  styleUrl: './goals.css',
  templateUrl: './goals.html',
  imports: [
    NoData,
    Button,
    NgClass,
    GoalItem,
    BillItem,
    GoalsForm,
    BillsForm,
    CalendarModule,
    GoalItemSkeleton,
    LucideAngularModule,
    BillItemSkeleton,
    FetchError
],
})
export class Goals {
  // Icons
  protected readonly iconSize = 16;
  protected readonly PlusIcon = Plus;

  // Services
  protected readonly billsService = inject(BillsService);
  protected readonly goalsService = inject(GoalsService);
  protected readonly drawerService = inject(DrawerService);
  protected readonly accountsService = inject(AccountsService);

  // Signals
  protected readonly isGoalsFormOpen = signal<boolean>(false);
  protected readonly isBillsFormOpen = signal<boolean>(false);

  // Data
  protected readonly bills$ = this.billsService.getUserBills();
  protected readonly goals$ = this.goalsService.getUserGoals();
  protected readonly currency = this.accountsService.getDefaultCurrency() || 'USD';

  // Computed
  protected readonly isFetchingBills = computed(() => this.bills$.isLoading());
  protected readonly isFetchingGoals = computed(() => this.goals$.isLoading());
}
