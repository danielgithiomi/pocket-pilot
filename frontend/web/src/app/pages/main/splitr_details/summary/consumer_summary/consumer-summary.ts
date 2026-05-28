import { NgClass } from '@angular/common';
import { COLOR_PALETTE } from '@libs/constants';
import { Badge } from '@components/ui/atoms/badge';
import { formatCurrency, hashFromName } from '@libs/utils';
import { Component, computed, input } from '@angular/core';

@Component({
    imports: [NgClass, Badge],
    selector: 'consumer-summary',
    template: `
        <div
            class="shadow-xl flex flex-row items-center justify-between px-3 py-4 gap-3 cursor-default! hover:cursor-pointer! card-item-border"
        >
            <div
                class="rounded-full size-8 grid place-items-center shrink-0"
                [ngClass]="avatarClasses().bg"
            >
                <p class="text-sm font-semibold" [ngClass]="avatarClasses().fg">
                    {{ consumerData().consumerName.charAt(0).toUpperCase() }}
                </p>
            </div>

            <div class="flex-1 flex flex-col gap-1">
                <p class="text-sm font-semibold">{{ consumerData().consumerName }}</p>
                <p class="text-xs text-muted-text">
                    {{ consumerData().itemsConsumed }}
                    {{ consumerData().itemsConsumed > 1 ? 'Ordered items' : 'Ordered item' }}
                </p>
            </div>

            <div class="flex flex-col items-end gap-1">
                <p class="text-sm font-bold">{{ formattedAmountPayable() }}</p>
                <atom-badge
                    [label]="consumerData().isSettled ? 'Settled' : 'Pending'"
                    [variant]="consumerData().isSettled ? 'success' : 'warning'"
                />
            </div>
        </div>
    `,
})
export class ConsumerSummary {
    // INPUTS
    readonly billingCurrency = input.required<string>();
    readonly consumerData = input.required<IConsumerSummary>();

    // COMPUTED
    protected readonly formattedAmountPayable = computed(() => {
        return formatCurrency(
            this.consumerData().amountPayable,
            this.billingCurrency(),
            2,
            true,
            true,
        );
    });

    protected readonly avatarClasses = computed<{ bg: string; fg: string }>(
        () =>
            COLOR_PALETTE[
                Math.abs(hashFromName(this.consumerData().consumerName)) % COLOR_PALETTE.length
            ],
    );
}

export interface IConsumerSummary {
    isSettled: boolean;
    consumerName: string;
    amountPayable: number;
    itemsConsumed: number;
}
