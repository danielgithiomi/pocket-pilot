import { Bill } from '@global/types';
import { NgClass } from '@angular/common';
import { AccountsService } from '@api/accounts.service';
import { formatCurrency, formatDate } from '@libs/utils';
import { LucideAngularModule, Sailboat, Trash } from 'lucide-angular';
import { Component, computed, inject, input, signal } from '@angular/core';

@Component({
  selector: 'bill-item',
  styleUrl: './bill-item.css',
  templateUrl: './bill-item.html',
  imports: [LucideAngularModule, NgClass],
})
export class BillItem {
  // Icons
  protected readonly iconSize = 20;
  protected readonly trash = Trash;
  protected readonly sailboat = Sailboat;

  // Inputs
  readonly billItem = input.required<Bill>();

  // Signals
  readonly isDeleting = signal<boolean>(false);

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

  // API Methods
  protected deleteBillItem(billItemId: string) {
    this.isDeleting.set(true);
    // TODO: Call API to delete bill item
    // this.isDeleting.set(false);
  }
}
