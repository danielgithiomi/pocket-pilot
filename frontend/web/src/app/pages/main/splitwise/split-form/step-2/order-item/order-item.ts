import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { IOrderItem } from '@global/types';
import { formatCurrency } from '@libs/utils';
import { QUANTITIES } from '@libs/constants';
import { form } from '@angular/forms/signals';
import { Select, SelectOption } from '@atoms/select';
import { AccountsService } from '@api/accounts.service';
import { SplitwiseService } from '@api/splitwise.service';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { LucideAngularModule, Trash2, ChevronDown, ChevronUp } from 'lucide-angular';
import {
  NewSplittableSchema,
  NewSplittableFormValidation as FormValidation,
} from '../split-form-step-2.types';
import { ISquadMember, SquadMember } from '@components/structural/main/squad-member/squad-member';

@Component({
  selector: 'order-item',
  styleUrl: 'order-item.css',
  templateUrl: 'order-item.html',
  imports: [Button, LucideAngularModule, Input, Select, SquadMember],
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
  protected readonly isUpdatingSplittable = signal<boolean>(false);

  // SERVICES
  private readonly accountsService = inject(AccountsService);
  private readonly splitwiseService = inject(SplitwiseService);

  // DATA
  protected readonly currency = this.accountsService.getDefaultCurrency();
  protected readonly categoryTags = this.splitwiseService.getOrderCategoryTags();

  // REACTIVE
  protected readonly formattedUnitPrice = computed<string>(() =>
    formatCurrency(this.order().unitPrice, this.currency, 2, false),
  );
  protected readonly formattedTotal = computed<string>(() =>
    formatCurrency(this.order().unitPrice * this.order().quantity, this.currency, 2, true),
  );

  // COMPUTED
  protected readonly orderItemId = computed<string>(() => `order-item-${this.order().id}`);
  protected readonly orderQuantities = computed<SelectOption[]>(() =>
    QUANTITIES.map((quantity) => ({
      value: quantity,
      label: quantity.toString(),
    })),
  );
  protected readonly categoryTagOptions = computed<SelectOption[]>(() => {
    if (this.categoryTags.error()) return [];

    const tags = this.categoryTags.value()?.data;

    if (!tags) {
      console.log('No tag data found in the resource!');
      return [];
    }

    return tags.map((tag) => ({
      value: tag.value,
      label: tag.label,
    }));
  });
  protected readonly formattedConsumers = computed<ISquadMember[]>(() => {
    return this.order().consumers.map((consumer) => ({
      memberName: consumer,
      isChecked: this.order().consumers.includes(consumer),
    }));
  });

  // FORMS
  protected readonly updateSplittableFormModel = signal<NewSplittableSchema>({
    name: '',
    quantity: 1,
    categoryTag: '',
    consumers: [],
    unitPrice: null,
  });
  protected readonly updateSplittableForm = form(this.updateSplittableFormModel, FormValidation);

  // METHODS
  protected updateSplittable(event: Event): void {
    event.preventDefault();
    console.log('Updating splittable');
  }

  protected updateOrderConsumers(memberName: string): void {
    console.log;
  }

  // CONSTRUCTOR
  constructor() {
    // Initialize form when order input becomes available
    effect(() => {
      const orderData = this.order();
      if (orderData) {
        this.updateSplittableFormModel.set(orderData);
      }
    });
  }
}
