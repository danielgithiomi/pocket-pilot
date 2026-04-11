import { Bill } from '@global/types';
import { AccountsService } from '@api/accounts.service';
import { formatCurrency, formatDate } from '@libs/utils';
import { LucideAngularModule, Sailboat } from 'lucide-angular';
import { Component, computed, inject, input } from '@angular/core';

@Component({
  selector: 'bill-item',
  styleUrl: './bill-item.css',
  imports: [LucideAngularModule],
  templateUrl: './bill-item.html',
})
export class BillItem {
  // Icons
  protected readonly iconSize = 20;
  protected readonly sailboat = Sailboat;

  // Inputs
  readonly billItem = input.required<Bill>();

  // Services
  protected readonly accountsService = inject(AccountsService);

  // Data
  protected readonly currency = this.accountsService.getDefaultCurrency();

  // Computed
  protected readonly billItemId = computed(() => `bill-item-${this.billItem().id}`);

  protected readonly formattedAmount = computed<string>(() => {
    const amount = this.billItem().amount;
    return formatCurrency(amount, this.billItem().currency, 2, true, false);
  });

  protected readonly formattedDate = computed<string>(() => {
    const date = this.billItem().dueDate;
    return formatDate(date);
  });

  protected readonly covertedCurrencyAmount = computed<string>(() => {
    const amount = this.billItem().amount;
    const convertedAmount = amount * 46.52;
    return formatCurrency(convertedAmount, this.currency, 2, true);
  });
}
