import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { IOrderItem } from '@global/types';
import { ToastService } from '@atoms/toast';
import { formatCurrency } from '@libs/utils';
import { QUANTITIES } from '@libs/constants';
import { form } from '@angular/forms/signals';
import { Select, SelectOption } from '@atoms/select';
import { AccountsService } from '@api/accounts.service';
import { SplitwiseService } from '@api/splitwise.service';
import { PlaceholderSplittableFormState as placeholder } from './order-tem.types';
import { LucideAngularModule, Trash2, ChevronDown, ChevronUp } from 'lucide-angular';
import { ISquadMember, SquadMember } from '@structural/main/squad-member/squad-member';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  NewSplittableSchema,
  NewSplittableFormValidation as FormValidation,
} from '../split-form-step-2.types';

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
  readonly presentMembers = input.required<string[]>();

  // OUTPUTS
  readonly onDeleteClickEvent = output<number>();
  readonly onUpdateSplittableEvent = output<IOrderItem>();

  // INTERNAL STATES
  protected readonly isExpanded = signal<boolean>(false);
  protected readonly isUpdatingSplittable = signal<boolean>(false);

  // SERVICES
  private readonly toastService = inject(ToastService);
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
    return this.presentMembers().map((consumer) => ({
      memberName: consumer,
      isChecked: this.updateSplittableForm().value().consumers.includes(consumer),
    }));
  });

  // FORMS
  protected readonly updateSplittableFormModel = signal<NewSplittableSchema>(placeholder);
  protected readonly updateSplittableForm = form(this.updateSplittableFormModel, FormValidation);

  // METHODS
  protected updateSplittable(event: Event): void {
    event.preventDefault();

    const { name, quantity, unitPrice, categoryTag, consumers } =
      this.updateSplittableForm().value();

    if (!unitPrice) {
      this.toastService.show({
        variant: 'error',
        title: 'Unit price is invalid!',
        details: 'Please enter a valid unit price for this item.',
      });
      return;
    }

    const total = unitPrice * quantity;

    const updatedOrder: IOrderItem = {
      ...this.order(),
      name,
      total,
      quantity,
      unitPrice,
      consumers,
      categoryTag,
    };

    this.onUpdateSplittableEvent.emit({ ...updatedOrder });
  }

  protected updateOrderConsumers(memberName: string): void {
    const orderQuantity = this.updateSplittableForm().value().quantity;
    const currentConsumers = this.updateSplittableForm().value().consumers;

    let updatedMembers: string[];
    const memberExists = currentConsumers.includes(memberName);

    if (memberExists) updatedMembers = currentConsumers.filter((member) => member !== memberName);
    else {
      if (currentConsumers.length >= orderQuantity) {
        this.toastService.show({
          variant: 'error',
          title: 'Quantity mismatch!',
          details: 'You want to add more consumers than the quantity of the item.',
        });
        return;
      }
      updatedMembers = [...currentConsumers, memberName];
    }

    this.updateSplittableForm.consumers().controlValue.set(updatedMembers);
  }

  // CONSTRUCTOR
  constructor() {
    // Initialize form when order input becomes available
    effect(() => {
      const orderData = this.order();
      if (orderData) this.updateSplittableFormModel.set(orderData);
    });
  }
}
