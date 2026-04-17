import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { GoalsForm, BillsForm } from './forms';
import { GoalsService } from '@api/goals.service';
import { BillsService } from '@api/bills.service';
import { AccountsService } from '@api/accounts.service';
import { DrawerService } from '@infrastructure/services';
import { NoData } from '@structural/main/no-data/no-data';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { Component, computed, inject, signal } from '@angular/core';
import { FetchError } from '@structural/main/fetch-error/fetch-error';
import { GoalItem, BillItem, BillItemSkeleton, GoalItemSkeleton } from './items';

@Component({
  selector: 'goals-and-bill',
  styleUrl: './goals-and-bills.css',
  templateUrl: './goals-and-bill.html',
  imports: [
    NoData,
    Button,
    NgClass,
    GoalItem,
    BillItem,
    GoalsForm,
    BillsForm,
    FetchError,
    CalendarModule,
    GoalItemSkeleton,
    BillItemSkeleton,
    LucideAngularModule,
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

  // Methods
  protected onFormClose(form: 'goals' | 'bills') {
    switch (form) {
      case 'goals':
        this.isGoalsFormOpen.set(false);
        break;
      case 'bills':
        this.isBillsFormOpen.set(false);
        break;
    }
  }
}
