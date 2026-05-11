import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { formatCurrency } from '@libs/utils';
import { SplittablePayload } from '@global/types';
import { AccountsService } from '@api/accounts.service';
import { Component, computed, inject, output, signal } from '@angular/core';
import { LucideAngularModule, ArrowLeft, ListFilterPlus } from 'lucide-angular';

@Component({
  selector: 'split-form-step-2',
  styleUrl: './split-form-step-2.css',
  templateUrl: './split-form-step-2.html',
  imports: [NgClass, LucideAngularModule, Button],
})
export class SplitFormStep2 {
  // ICONS
  protected readonly iconSize = 20;
  protected readonly leftArrow = ArrowLeft;
  protected readonly addItem = ListFilterPlus;

  // OUTPUTS
  readonly onBackIconClick = output<void>();

  // INTERNAL STATE
  protected readonly splittables = signal<SplittablePayload[]>([]);
  protected readonly isSubmittingSplittable = signal<boolean>(false);

  // SERVICES
  private readonly accountsService = inject(AccountsService);

  // DATA
  protected readonly currency = this.accountsService.getDefaultCurrency();

  // COMPUTED
  protected readonly itemsCount = computed<number>(() => this.splittables().length);
  protected readonly formattedSubTotal = computed<string>(() => {
    const subtotal: number = 0;
    return formatCurrency(subtotal, this.currency, 2, true);
  });

  // METHODS
  protected addNewSplittable(): void {
    // TODO: Implement adding new splittable item
  }
}
