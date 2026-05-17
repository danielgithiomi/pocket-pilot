import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { formatCurrency } from '@libs/utils';
import { QUANTITIES } from '@libs/constants';
import { form } from '@angular/forms/signals';
import { LocalQuantitySplit, SplittableOrder } from '@global/types';
import { OrderItem } from './order-item/order-item';
import { Select, SelectOption } from '@atoms/select';
import { SplitwiseService } from '@api/splitwise.service';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import {
  ISquadMember,
  SquadMember,
  SquadMemberQuantityChangeEmmision,
} from '@structural/main/squad-member/squad-member';
import { ArrowLeft, PanelTopClose, PanelBottomClose, LucideAngularModule } from 'lucide-angular';
import {
  NewSplittableSchema,
  InitialNewSplittableData,
  NewSplittableFormValidation,
  SplitStrategyVariant,
  STRATEGY_MAP,
  SPLIT_STRATEGY_OPTIONS,
  SplitStrategyOption,
} from './split-form-step-2.types';
import { AuthService } from '@api/auth.service';
import { QuantityChangeVariant } from '@components/structural/main/squad-member/member-quantifier/member-quantifier';

@Component({
  selector: 'split-form-step-2',
  styleUrl: './split-form-step-2.css',
  templateUrl: './split-form-step-2.html',
  imports: [NgClass, LucideAngularModule, Button, Input, Select, SquadMember, OrderItem],
})
export class SplitFormStep2 {
  // ICONS
  protected readonly leftArrow = ArrowLeft;
  protected readonly HideForm = PanelTopClose;
  protected readonly ShowForm = PanelBottomClose;

  // INPUTS
  readonly iconSize = input.required<number>();
  readonly currency = input.required<string>();
  readonly presentMembers = input.required<string[]>();
  readonly splittables = input.required<SplittableOrder[]>();

  // OUTPUTS
  readonly onBackIconClick = output<void>();
  readonly onSplittablesChangeEvent = output<SplittableOrder[]>();

  // INTERNAL STATE
  protected readonly isFormVisible = signal<boolean>(false);
  protected readonly isSubmittingSplittable = signal<boolean>(false);

  // SERVICES
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly splitwiseService = inject(SplitwiseService);

  // DATA
  private readonly user = this.authService.user();
  protected readonly categoryTagsResource = this.splitwiseService.getOrderCategoryTags();

  // COMPUTED
  protected readonly consumerOptions = computed<string[]>(() => {
    const userFirstName = this.user?.name.split(' ')[0];
    return [`${userFirstName}(Self)`, ...this.presentMembers()];
  });
  protected readonly quantityAssisgnableRemaining = computed<number>(() => {
    const orderSplits = this.splittableForm().value().quantitySplits;
    const orderQuantity = Number(this.splittableForm().value().quantity);

    const totalAssignedQuantity = orderSplits.reduce(
      (acc, split) => acc + split.consumerQuantity,
      0,
    );

    return orderQuantity - totalAssignedQuantity;
  });
  protected readonly canAddConsumer = computed<boolean>(() => {
    const quantity = Number(this.splittableForm().value().quantity);
    const splitStrategy = this.splittableForm().value().splitStrategy;

    if (splitStrategy === 'equal' && quantity >= 1) return true;

    return this.quantityAssisgnableRemaining() > 0;
  });
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
  protected readonly isSplitStrategyVisible = computed<boolean>(() => {
    const quantity = Number(this.splittableForm().value().quantity);
    return quantity > 1;
  });
  protected readonly isStrategyCustom = computed<boolean>(() => {
    const strategy = this.splittableForm().value().splitStrategy;
    return strategy === 'quantity';
  });
  protected readonly splitStrategyOptions = computed<SelectOption[]>(() => {
    return SPLIT_STRATEGY_OPTIONS.map((strategy: SplitStrategyOption) => ({
      value: strategy,
      label: STRATEGY_MAP[strategy],
    }));
  });
  protected readonly formattedSubTotal = computed<string>(() => {
    const subtotal = this.splittables().reduce((acc, splittable) => acc + splittable.total, 0);
    return formatCurrency(subtotal, this.currency(), 2, true);
  });
  protected readonly formattedConsumers = computed<ISquadMember[]>(() => {
    const currentSplits = this.splittableForm().value().quantitySplits;
    const currentMembers = currentSplits.map((split) => split.consumerName);

    return this.consumerOptions().map((member) => ({
      memberName: member,
      isChecked: currentMembers.includes(member),
      quantity: currentSplits.find((split) => split.consumerName === member)?.consumerQuantity || 1,
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
    const strategy = this.splittableForm().value().splitStrategy;
    const orderSplits = this.splittableForm().value().quantitySplits;
    const consumersInOrder = orderSplits.map((split) => split.consumerName);

    if (strategy === 'sole' && consumersInOrder.length >= 1) {
      this.toastService.show({
        variant: 'warning',
        title: 'Consumed by one!',
        details: 'An item consumed by one cannot have more than one consumer.',
      });
      return;
    }

    let updatedSplits: LocalQuantitySplit[];
    const memberExists = consumersInOrder.includes(memberName);

    if (memberExists)
      updatedSplits = orderSplits.filter((split) => split.consumerName !== memberName);
    else {
      if (!this.canAddConsumer()) {
        this.toastService.show({
          variant: 'error',
          title: 'Quantity mismatch!',
          details: 'You want to add more consumers than the quantity of the item.',
        });
        return;
      }
      const newSplit: LocalQuantitySplit = {
        id: crypto.randomUUID(),
        consumerName: memberName,
        consumerQuantity: 1,
      };
      updatedSplits = [...orderSplits, newSplit];
    }

    this.splittableForm.quantitySplits().controlValue.set(updatedSplits);
  }

  protected handleOnConsumerQuantityChange(event: SquadMemberQuantityChangeEmmision): void {
    const { memberName, quantityChangeVariant } = event;

    const currentSplits = this.splittableForm().value().quantitySplits;

    const updatedSplits = currentSplits.map((split) => {
      if (split.consumerName === memberName)
        return {
          ...split,
          consumerQuantity:
            quantityChangeVariant === 'increase'
              ? split.consumerQuantity + 1
              : split.consumerQuantity - 1,
        };

      return split;
    });

    this.splittableForm.quantitySplits().controlValue.set(updatedSplits);
  }

  protected addNewSplittable(event: Event): void {
    event.preventDefault();

    const {
      name,
      unitPrice,
      categoryTag,
      quantitySplits,
      quantity: quantityStr,
    } = this.splittableForm().value();

    if (quantitySplits.length < 1) {
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

    const quantity = Number(quantityStr);
    const total = quantity * unitPrice!;

    const newSplittable: SplittableOrder = {
      id: this.splittables().length + 1,
      name,
      total,
      quantity,
      unitPrice,
      categoryTag,
      quantitySplits,
      settled: false,
    };

    this.resetSplittableForm();

    const modifiedSplittables = [...this.splittables(), newSplittable].reverse();
    this.onSplittablesChangeEvent.emit(modifiedSplittables);
  }

  protected updateEventSplittables(splittable: SplittableOrder) {
    const splittableExists = this.splittables().find((s) => s.id === splittable.id);

    if (!splittableExists) {
      this.toastService.show({
        variant: 'error',
        title: 'Splittable not found!',
        details: 'The splittable you are trying to update does not exist.',
      });
      return;
    }

    const updatedSplittable: SplittableOrder = {
      ...splittable,
      total: splittable.quantity * splittable.unitPrice,
    };

    const modifiedSplittables = this.splittables().map((splittableItem) =>
      splittableItem.id === updatedSplittable.id ? updatedSplittable : splittableItem,
    );

    this.onSplittablesChangeEvent.emit(modifiedSplittables);
  }

  protected handleOnDeleteOrder(orderId: number) {
    const modifiedSplittables = this.splittables().filter(
      (splittable) => splittable.id !== orderId,
    );

    this.onSplittablesChangeEvent.emit(modifiedSplittables);
  }

  constructor() {
    effect(() => {
      const quantity = Number(this.splittableForm.quantity().controlValue());
      const nextStrategy: SplitStrategyVariant = quantity > 1 ? 'equal' : 'sole';

      untracked(() => {
        this.splittableForm.quantitySplits().controlValue.set([]); // reset splits when strategy changes
        const strategyControl = this.splittableForm.splitStrategy().controlValue;
        if (strategyControl() !== nextStrategy) {
          strategyControl.set(nextStrategy);
        }
      });
    });
  }
}
