import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { IOrderItem } from '@global/types';
import { ToastService } from '@atoms/toast';
import { formatCurrency } from '@libs/utils';
import { QUANTITIES } from '@libs/constants';
import { form } from '@angular/forms/signals';
import { OrderItem } from './order-item/order-item';
import { Select, SelectOption } from '@atoms/select';
import { AccountsService } from '@api/accounts.service';
import { SplitwiseService } from '@api/splitwise.service';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ISquadMember, SquadMember } from '@structural/main/squad-member/squad-member';
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
  imports: [NgClass, LucideAngularModule, Button, Input, Select, SquadMember, OrderItem],
})
export class SplitFormStep2 {
  // ICONS
  protected readonly iconSize = 20;
  protected readonly leftArrow = ArrowLeft;
  protected readonly HideForm = PanelTopClose;
  protected readonly ShowForm = PanelBottomClose;

  // INPUTS
  readonly currency = input.required<string>();
  readonly presentMembers = input.required<string[]>();

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
  protected readonly categoryTagsResource = this.splitwiseService.getOrderCategoryTags();

  // COMPUTED
  protected readonly itemsCount = computed<number>(() => this.splittables().length);
  protected readonly isFetchingData = computed<boolean>(() =>
    this.categoryTagsResource.isLoading(),
  );
  protected readonly orderQuantities = computed<SelectOption[]>(() => {
    return QUANTITIES.map((quantity) => ({
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
  protected readonly formattedSubTotal = computed<string>(() => {
    const subtotal = this.splittables().reduce((acc, splittable) => acc + splittable.total, 0);
    return formatCurrency(subtotal, this.currency(), 2, true);
  });
  protected readonly formattedConsumers = computed<ISquadMember[]>(() => {
    const currentMembers = this.splittableForm().value().consumers;
    return this.presentMembers().map((member) => ({
      memberName: member,
      isChecked: currentMembers.includes(member),
    }));
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

  protected addConsumerToOrder(memberName: string): void {
    const orderQuantity = this.splittableForm().value().quantity;
    const currentConsumers = this.splittableForm().value().consumers;

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

    this.splittableForm.consumers().controlValue.set(updatedMembers);
  }

  protected addNewSplittable(event: Event): void {
    event.preventDefault();

    const { name, quantity, unitPrice, categoryTag, consumers } = this.splittableForm().value();

    if (consumers.length < 1) {
      this.toastService.show({
        variant: 'error',
        title: 'Consumers are required!',
        details: 'Please select at least one consumer.',
      });
      return;
    }

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
    this.resetSplittableForm();
  }

  protected handleOnDeleteOrder(orderId: number) {
    this.splittables.update((splittables) =>
      splittables.filter((splittable) => splittable.id !== orderId),
    );
  }
}
