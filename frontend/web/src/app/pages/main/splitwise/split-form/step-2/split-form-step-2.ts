import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { IOrderItem } from '@global/types';
import { formatCurrency } from '@libs/utils';
import { OrderItem } from './order-item/order-item';
import { AccountsService } from '@api/accounts.service';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { LucideAngularModule, ArrowLeft, ListFilterPlus } from 'lucide-angular';

@Component({
  selector: 'split-form-step-2',
  styleUrl: './split-form-step-2.css',
  templateUrl: './split-form-step-2.html',
  imports: [NgClass, LucideAngularModule, Button, OrderItem],
})
export class SplitFormStep2 {
  // ICONS
  protected readonly iconSize = 20;
  protected readonly leftArrow = ArrowLeft;
  protected readonly addItem = ListFilterPlus;

  // INPUTS
  readonly currency = input.required<string>();

  // OUTPUTS
  readonly onBackIconClick = output<void>();

  // INTERNAL STATE
  protected readonly splittables = signal<IOrderItem[]>([]);
  protected readonly isSubmittingSplittable = signal<boolean>(false);

  // SERVICES
  private readonly accountsService = inject(AccountsService);

  // DATA

  // COMPUTED
  protected readonly itemsCount = computed<number>(() => this.splittables().length);
  protected readonly formattedSubTotal = computed<string>(() => {
    const subtotal: number = 0;
    return formatCurrency(subtotal, this.currency(), 2, true);
  });

  // METHODS
  protected addNewSplittable(): void {
    const newSplittable: IOrderItem = {
      id: this.splittables().length + 1,
      name: 'Daniel',
      total: 0,
      quantity: 1,
      unitPrice: 0,
      consumers: [],
      settled: false,
      categoryTag: '',
    };

    this.splittables.update((splittables) => [...splittables, newSplittable].reverse());
  }

  protected handleOnDeleteOrder(orderId: number) {
    this.splittables.update((splittables) =>
      splittables.filter((splittable) => splittable.id !== orderId),
    );
  }
}
