import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { Select, SelectOption } from '@atoms/select';
import { NgClass } from '@angular/common';
import { IOrderItem } from '@global/types';
import { ToastService } from '@atoms/toast';
import { formatCurrency } from '@libs/utils';
import { form } from '@angular/forms/signals';
import { OrderItem } from './order-item/order-item';
import { AccountsService } from '@api/accounts.service';
import { SplitwiseService } from '@api/splitwise.service';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ArrowLeft, PanelTopClose, PanelBottomClose, LucideAngularModule } from 'lucide-angular';
import {
  NewSplittableSchema,
  InitialNewSplittableData,
  NewSplittableFormValidation,
} from './split-form-step-2.types';

@Component({
  selector: 'split-form-step-2',
  styleUrl: './split-form-step-2.css',
  templateUrl: './split-form-step-2.html',
  imports: [NgClass, LucideAngularModule, Button, Input, Select, OrderItem],
})
export class SplitFormStep2 {
  // ICONS
  protected readonly iconSize = 20;
  protected readonly leftArrow = ArrowLeft;
  protected readonly HideForm = PanelTopClose;
  protected readonly ShowForm = PanelBottomClose;

  // INPUTS
  readonly currency = input.required<string>();

  // OUTPUTS
  readonly onBackIconClick = output<void>();

  // INTERNAL STATE
  protected readonly isFormVisible = signal<boolean>(false);
  protected readonly splittables = signal<IOrderItem[]>([]);
  protected readonly isSubmittingSplittable = signal<boolean>(false);

  // SERVICES
  private readonly toastService = inject(ToastService);
  private readonly accountsService = inject(AccountsService);
  private readonly splitwiseService = inject(SplitwiseService);

  // DATA
  protected readonly quantities = signal<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  protected readonly categoryTagsResource = this.splitwiseService.getOrderCategoryTags();

  // COMPUTED
  protected readonly isFetchingData = computed<boolean>(() =>
    this.categoryTagsResource.isLoading(),
  );
  protected readonly orderQuantities = computed<SelectOption[]>(() => {
    return this.quantities().map((quantity) => ({
      value: quantity,
      label: quantity.toString(),
    }));
  });
  protected readonly categoryTags = computed<SelectOption[]>(() => {
    if (this.categoryTagsResource.error()) return [];

    const fetchedTags = this.categoryTagsResource.value()?.data;

    if (!fetchedTags) return [];

    return fetchedTags.map((tag) => {
      const { label, value } = tag;
      return { label, value };
    });
  });
  protected readonly itemsCount = computed<number>(() => this.splittables().length);
  protected readonly formattedSubTotal = computed<string>(() => {
    const subtotal: number = 0;
    return formatCurrency(subtotal, this.currency(), 2, true);
  });

  // FORM
  protected readonly splittableFormModel = signal<NewSplittableSchema>(InitialNewSplittableData);
  protected readonly splittableForm = form<NewSplittableSchema>(
    this.splittableFormModel,
    NewSplittableFormValidation,
  );

  // METHODS
  protected resetSplittableForm(): void {
    this.splittableForm().reset();
    this.splittableFormModel.set(InitialNewSplittableData);
  }
  
  protected addNewSplittable(event: Event): void {
    event.preventDefault();

    const { name, quantity, unitPrice, categoryTag, consumers } = this.splittableForm().value();

    if (!unitPrice) {
      this.toastService.show({
        variant: 'error',
        title: 'Unit price is required',
        details: 'Please enter a valid unit price of at least 1.',
      });
      return;
    }

    const total = quantity * unitPrice!;

    const newSplittable: IOrderItem = {
      id: this.splittables().length + 1,
      name,
      total,
      quantity,
      unitPrice,
      consumers,
      categoryTag,
      settled: false,
    };

    this.splittables.update((splittables) => [...splittables, newSplittable].reverse());
  }

  protected handleOnDeleteOrder(orderId: number) {
    this.splittables.update((splittables) =>
      splittables.filter((splittable) => splittable.id !== orderId),
    );
  }
}
