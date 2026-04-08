import { NgClass } from '@angular/common';
import { Goal, GoalStatus } from '@global/types';
import { ProgressBar } from '@atoms/progress-bar';
import { AccountsService } from '@api/accounts.service';
import { GoalCategoryEnum, GoalStatusEnum } from '@global/enums';
import { Component, computed, inject, input } from '@angular/core';
import { convertDaysToYearsAndMonths, formatCurrency } from '@libs/utils';
import {
  Coins,
  Plane,
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
  protected readonly iconSize = 18;

  // Inputs
  readonly id = input.required<string>();
  readonly goal = input.required<Goal>();

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

  // Services
  private readonly accountsService = inject(AccountsService);

  // Data
  private readonly currency = this.accountsService.getDefaultCurrency();

  // Computed
  protected readonly goalItemId = computed<string>(() => `goal-item-${this.id()}`);
  protected readonly remainingTime = computed<string>(() => {
    const today = new Date();
    const endDate = new Date(this.goal().endDate);
    const timeRemaining = endDate.getTime() - today.getTime();

    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
    return convertDaysToYearsAndMonths(daysRemaining);
  });

  // Helper functions
  protected formatCurrency(amount: number): string {
    return formatCurrency(amount, this.currency, 0, true);
  }
}
