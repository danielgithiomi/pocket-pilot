import { Button } from '@atoms/button';
import { IOrderItem } from '@global/types';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { LucideAngularModule, Trash2, ChevronDown, ChevronUp } from 'lucide-angular';
import { formatCurrency } from '@libs/utils';
import { AccountsService } from '@api/accounts.service';

@Component({
  selector: 'order-item',
  styleUrl: 'order-item.css',
  templateUrl: 'order-item.html',
  imports: [Button, LucideAngularModule],
})
export class OrderItem {
  // ICON
  protected readonly iconSize = 14;
  protected readonly DeleteIcon = Trash2;
  protected readonly ArrowUpIcon = ChevronUp;
  protected readonly ArrowDownIcon = ChevronDown;

  // INPUTS
  readonly order = input.required<IOrderItem>();

  // OUTPUTS
  readonly onDeleteClickEvent = output<number>();

  // INTERNAL STATES
  protected readonly isExpanded = signal<boolean>(false);

  // SERVICES
  private readonly accountsService = inject(AccountsService);

  // DATA
  protected readonly currency = this.accountsService.getDefaultCurrency();

  // COMPUTED
  protected readonly orderItemId = computed<string>(() => `order-item-${this.order().id}`);
  protected readonly formattedUnitPrice = computed<string>(() =>
    formatCurrency(this.order().unitPrice, this.currency, 2, false),
  );
  protected readonly formattedTotal = computed<string>(() =>
    formatCurrency(this.order().unitPrice * this.order().quantity, this.currency, 2, true),
  );
}
