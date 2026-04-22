import { Bill } from '@global/types';
import { NgClass } from '@angular/common';
import { ReceiptCent } from 'lucide-angular';
import { BillsService } from '@api/bills.service';
import { Component, computed, inject, input } from '@angular/core';
import { NoData } from '@components/structural/main/no-data/no-data';
import { DashboardCard } from '@structural/main/dashboard-card/dashboard-card';
import { BillItem, BillItemSkeleton } from '@pages/main/goals_and_bills/items';
import { FetchError } from '@components/structural/main/fetch-error/fetch-error';

@Component({
  selector: 'upcoming-bills',
  templateUrl: './upcoming-bills.html',
  imports: [DashboardCard, BillItemSkeleton, FetchError, NoData, BillItem, NgClass],
})
export class UpcomingBills {
  // ICONS
  protected readonly billsIcon = ReceiptCent;

  // INPUTS
  readonly iconSize = input.required<number>();

  // SIGNALS

  // SERVICES
  private readonly billsService = inject(BillsService);

  // DATA
  protected readonly bills$ = this.billsService.getUserBills();

  // COMPUTED
  protected readonly isFetchingBills = computed(() => this.bills$.isLoading());

  protected readonly upcomingBills = computed<Bill[]>(() => {
    const now = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(now.getDate() + 7);

    const allBills = this.bills$.value()?.data;

    if (!allBills) return [];

    return allBills.filter((bill) => {
      const billDueDate = new Date(bill.dueDate);
      return billDueDate >= now && billDueDate <= oneWeekFromNow;
    });
  });
}
