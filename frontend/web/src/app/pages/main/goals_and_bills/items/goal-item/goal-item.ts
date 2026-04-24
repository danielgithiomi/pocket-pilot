import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { ProgressBar } from '@atoms/progress-bar';
import { GoalsService } from '@api/goals.service';
import { AccountsService } from '@api/accounts.service';
import { Goal, IVoidResourceResponse } from '@global/types';
import { GoalCategoryEnum, GoalStatusEnum } from '@global/enums';
import { convertDaysToYearsAndMonths, formatCurrency } from '@libs/utils';
import { Component, computed, inject, input, signal } from '@angular/core';
import {
  Coins,
  Plane,
  Trash,
  Wallet,
  Bitcoin,
  TreePalm,
  Landmark,
  Activity,
  HandCoins,
  Ambulance,
  ScanBarcode,
  GraduationCap,
  LucideIconData,
  LucideAngularModule,
} from 'lucide-angular';

@Component({
  selector: 'goal-item',
  styleUrl: './goal-item.css',
  templateUrl: './goal-item.html',
  imports: [LucideAngularModule, ProgressBar, NgClass],
})
export class GoalItem {
  // Icons
  protected readonly iconSize = 24;
  protected readonly trash = Trash;

  // Inputs
  readonly goalItem = input.required<Goal>();

  // Icon Maps
  protected readonly ICON_MAP: Record<GoalCategoryEnum, LucideIconData> = {
    OTHER: Coins,
    TRAVEL: Plane,
    LOAN: Landmark,
    SAVINGS: Wallet,
    VACATION: TreePalm,
    RETIREMENT: Activity,
    INVESTMENTS: Bitcoin,
    PURCHASE: ScanBarcode,
    DEBT_PAYMENT: HandCoins,
    EDUCATION: GraduationCap,
    EMERGENCY_FUND: Ambulance,
  };

  // Color maps
  protected readonly STATUS_COLOR_MAP: Record<GoalStatusEnum, string> = {
    FAILED: 'bg-(--danger)',
    ACTIVE: 'bg-(--primary)',
    PAUSED: 'bg-(--warning)',
    COMPLETED: 'bg-(--success)',
  };

  // Signal States
  protected readonly isDeleting = signal<boolean>(false);

  // Services
  private readonly goalsService = inject(GoalsService);
  private readonly toastService = inject(ToastService);
  private readonly accountsService = inject(AccountsService);

  // Computed
  protected readonly goalItemId = computed<string>(() => `goal-item-${this.goalItem().id}`);
  protected readonly remainingTime = computed<string>(() => {
    const today = new Date();
    const endDate = new Date(this.goalItem().endDate);
    const timeRemaining = endDate.getTime() - today.getTime();

    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
    return convertDaysToYearsAndMonths(daysRemaining);
  });

  // Methods
  protected deleteGoalItem(goalItemId: string): void {
    this.isDeleting.set(true);

    setTimeout(() => {
      this.goalsService.deleteGoalById(goalItemId).subscribe({
        next: (response: IVoidResourceResponse) => {
          const { message, details } = response;
          this.toastService.show({
            details,
            title: message,
            variant: 'success',
          });

          this.goalsService.getUserGoals().reload();
        },
        complete: () => {
          this.isDeleting.set(false);
        },
      });
    }, 2500);
  }

  // Helper functions
  protected formatCurrency(amount: number): string {
    return formatCurrency(amount, this.goalItem().currency, 0, true);
  }
}
