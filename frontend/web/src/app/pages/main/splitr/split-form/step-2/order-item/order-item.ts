import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { ToastService } from '@atoms/toast';
import { formatCurrency } from '@libs/utils';
import { QUANTITIES } from '@libs/constants';
import { form } from '@angular/forms/signals';
import { SplitrService } from '@api/splitr.service';
import { Select, SelectOption } from '@atoms/select';
import { AccountsService } from '@api/accounts.service';
import { PlaceholderSplittableFormState as placeholder } from './order-item.types';
import { LucideAngularModule, Trash2, ChevronDown, ChevronUp } from 'lucide-angular';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { SquadMember, ISquadMember, QuantityChangeEmmision } from '@structural/main/squad-member/squad-member';
import { NewSplittableSchema, NewSplittableFormValidation as FormValidation } from '../split-form-step-2.types';
import {
    SplittableOrder,
    LocalQuantitySplit,
    SPLIT_STRATEGY_MAP,
    SplitStrategyVariant,
    SPLIT_STRATEGY_OPTIONS
} from '@global/types';

@Component({
    selector: 'order-item',
    styleUrl: 'order-item.css',
    templateUrl: 'order-item.html',
    imports: [Button, LucideAngularModule, Input, Select, SquadMember]
})
export class OrderItem {
    // ICON
    protected readonly iconSize = 14;
    protected readonly DeleteIcon = Trash2;
    protected readonly ArrowUpIcon = ChevronUp;
    protected readonly ArrowDownIcon = ChevronDown;

    // INPUTS
    readonly order = input.required<SplittableOrder>();
    readonly presentMembers = input.required<string[]>();

    // OUTPUTS
    readonly onDeleteClickEvent = output<number>();
    readonly onUpdateSplittableEvent = output<SplittableOrder>();

    // INTERNAL STATES
    protected readonly isExpanded = signal<boolean>(false);
    protected readonly isUpdatingSplittable = signal<boolean>(false);

    // SERVICES
    private readonly toastService = inject(ToastService);
    private readonly accountsService = inject(AccountsService);
    private readonly splitrService = inject(SplitrService);

    // DATA
    protected readonly currency = this.accountsService.getDefaultCurrency();

    // REACTIVE
    protected readonly formattedUnitPrice = computed<string>(() =>
        formatCurrency(this.order().unitPrice, this.currency, 2, false)
    );
    protected readonly formattedTotal = computed<string>(() =>
        formatCurrency(this.order().unitPrice * this.order().quantity, this.currency, 2, true)
    );

    // COMPUTED
    protected readonly orderItemId = computed<string>(() => `order-item-${this.order().id}`);
    protected readonly isStrategyCustom = computed<boolean>(() => {
        const strategy = this.updateSplittableForm().value().splitStrategy;
        return strategy === 'QUANTITY';
    });
    protected readonly splitStrategyOptions = computed<SelectOption[]>(() => {
        const quantity = Number(this.updateSplittableForm().value().quantity);
        return SPLIT_STRATEGY_OPTIONS.map((strategy: SplitStrategyVariant) => ({
            value: strategy,
            label: SPLIT_STRATEGY_MAP[strategy],
            disabled: strategy === 'QUANTITY' && quantity <= 1
        }));
    });
    protected readonly orderQuantities = computed<SelectOption[]>(() =>
        QUANTITIES.map((quantity) => ({
            value: quantity.toString(),
            label: quantity.toString()
        }))
    );
    protected readonly formattedConsumers = computed<ISquadMember[]>(() => {
        const currentSplits = this.updateSplittableForm().value().quantitySplits;
        const currentConsumers = currentSplits.map((split) => split.consumerName);

        return this.presentMembers().map((consumer) => ({
            memberName: consumer,
            isChecked: currentConsumers.includes(consumer),
            quantity: currentSplits.find((split) => split.consumerName === consumer)?.consumerQuantity || 1
        }));
    });
    protected readonly quantityAssisgnableRemaining = computed<number>(() => {
        const orderSplits = this.updateSplittableForm().value().quantitySplits;
        const orderQuantity = Number(this.updateSplittableForm().value().quantity);

        const totalAssignedQuantity = orderSplits.reduce((acc, split) => acc + split.consumerQuantity, 0);

        return orderQuantity - totalAssignedQuantity;
    });
    protected readonly canAddConsumer = computed<boolean>(() => {
        const quantity = Number(this.updateSplittableForm().value().quantity);
        const splitStrategy = this.updateSplittableForm().value().splitStrategy;

        if (splitStrategy === 'EQUAL' && quantity === 1) return true;

        return this.quantityAssisgnableRemaining() > 0;
    });

    // FORMS
    protected readonly updateSplittableFormModel = signal<NewSplittableSchema>(placeholder);
    protected readonly updateSplittableForm = form(this.updateSplittableFormModel, FormValidation);

    // METHODS
    protected updateSplittable(event: Event): void {
        event.preventDefault();

        const { name, quantity: quantityStr, unitPrice, quantitySplits } = this.updateSplittableForm().value();

        if (!unitPrice) {
            this.toastService.show({
                variant: 'error',
                title: 'Unit price is invalid!',
                details: 'Please enter a valid unit price for this item.'
            });
            return;
        }

        const quantity = Number(quantityStr);

        const totalSplitsQuantity = quantitySplits.reduce((acc, split) => acc + split.consumerQuantity, 0);

        if (totalSplitsQuantity !== quantity) {
            this.toastService.show({
                variant: 'error',
                title: 'Consumer Quantity Mismatch!',
                details: "The quantity and the number of consumers don't match up"
            });
            return;
        }

        const total = unitPrice * quantity;

        const updatedOrder: SplittableOrder = {
            ...this.order(),
            name,
            total,
            quantity,
            unitPrice,
            quantitySplits
        };

        this.onUpdateSplittableEvent.emit({ ...updatedOrder });
        this.isExpanded.set(false);
        this.updateSplittableForm().reset();
    }

    protected handleOnConsumerQuantityChange(event: QuantityChangeEmmision): void {
        const { memberName, quantityChangeVariant } = event;

        const currentSplits = this.updateSplittableForm().value().quantitySplits;

        const updatedSplits = currentSplits.map((split) => {
            if (split.consumerName === memberName)
                return {
                    ...split,
                    consumerQuantity:
                        quantityChangeVariant === 'increase' ? split.consumerQuantity + 1 : split.consumerQuantity - 1
                };

            return split;
        });

        this.updateSplittableForm.quantitySplits().controlValue.set(updatedSplits);
    }

    protected updateOrderConsumers(memberName: string): void {
        const orderSplits = this.updateSplittableForm().value().quantitySplits;
        const orderQuantity = Number(this.updateSplittableForm().value().quantity);
        const totalSplitsQuantity = orderSplits.reduce((acc, split) => acc + split.consumerQuantity, 0);

        let updatedSplits: LocalQuantitySplit[];
        const memberExists = orderSplits.map((split) => split.consumerName).includes(memberName);

        if (memberExists) updatedSplits = orderSplits.filter((split) => split.consumerName !== memberName);
        else {
            if (totalSplitsQuantity >= orderQuantity) {
                this.toastService.show({
                    variant: 'error',
                    title: 'Quantity mismatch!',
                    details: 'You want to add more consumers than the quantity of the item.'
                });
                return;
            }

            const newSplit: LocalQuantitySplit = {
                consumerQuantity: 1,
                id: crypto.randomUUID(),
                consumerName: memberName
            };

            updatedSplits = [...orderSplits, newSplit];
        }

        this.updateSplittableForm.quantitySplits().controlValue.set(updatedSplits);
    }

    // CONSTRUCTOR
    constructor() {
        effect(() => {
            const orderData = this.order();
            if (orderData)
                this.updateSplittableFormModel.set({
                    ...orderData,
                    quantity: orderData.quantity.toString()
                });
        });
    }
}
