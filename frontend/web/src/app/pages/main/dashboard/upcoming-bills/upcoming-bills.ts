import { ReceiptCent } from 'lucide-angular';
import { Component, computed, input } from '@angular/core';
import { DashboardCard } from '@structural/main/dashboard-card/dashboard-card';
import { BillItem, BillItemSkeleton } from '@pages/main/goals_and_bills/items';

@Component({
    selector: 'upcoming-bills',
    templateUrl: './upcoming-bills.html',
    imports: [DashboardCard, BillItemSkeleton, BillItem],
})
export class UpcomingBills {
  // ICONS
  protected readonly billsIcon = ReceiptCent;

  // INPUTS
  readonly iconSize = input.required<number>();

  // SIGNALS

  // COMPUTED
  protected readonly isFetchingBills = computed(() => {
    return true;
  });
}
