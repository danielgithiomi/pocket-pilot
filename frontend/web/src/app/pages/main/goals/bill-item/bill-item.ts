import { Bill } from '@global/types';
import { Component, computed, inject, input } from '@angular/core';
import { LucideAngularModule, Sailboat } from 'lucide-angular';
import { formatCurrency } from '@libs/utils';
import { AccountsService } from '@api/accounts.service';

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

  protected readonly formattedAmount = computed(() => {
    const amount = this.billItem().amount;
    return formatCurrency(amount, this.currency, 2, true);
  });
}
