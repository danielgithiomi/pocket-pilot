import { Badge } from '@atoms/badge';
import { NgClass } from '@angular/common';
import { COLOR_PALETTE } from '@libs/constants';
import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, Calendar1, Users } from 'lucide-angular';
import { formatCurrency, formatFullDate, hashFromName } from '@libs/utils';
import { ISplitrEvent, SPLIT_STRATEGY_MAP, SplitStrategyVariant } from '@global/types';

@Component({
    selector: 'splitr-breakdown',
    templateUrl: './splitr-breakdown.html',
    imports: [LucideAngularModule, Badge, NgClass],
    styles: `
        @reference "tailwindcss";

        lucide-icon {
            @apply text-(--primary);
        }

        .section-title {
            @apply font-bold uppercase text-(--primary-text);
        }
    `,
})
export class SplitrBreakdown {
    // ICONS
    protected readonly iconSize = 15;
    protected readonly Squads = Users;
    protected readonly CalendarIcon = Calendar1;
    // INPUTS
    readonly splitrEvent = input.required<ISplitrEvent>();

    // COMPUTED
    protected readonly eventId = computed(() => this.splitrEvent().id);
    protected readonly formattedEventDate = computed(() =>
        formatFullDate(this.splitrEvent().eventDate),
    );
    protected readonly payers = computed<EventPayer[]>(() => {
        const { billPayers, verificationTotal, billingCurrency } = this.splitrEvent();

        return billPayers.map((billPayer) => ({
            id: crypto.randomUUID(),
            payerName: billPayer.payerName,
            paidAmount: formatCurrency(billPayer.payerAmount, billingCurrency, 2, true),
            avatar: COLOR_PALETTE[
                Math.abs(hashFromName(billPayer.payerName)) % COLOR_PALETTE.length
            ],
            percentageContribution: Number(
                ((billPayer.payerAmount / verificationTotal) * 100).toFixed(2),
            ),
        }));
    });

    protected readonly orderedItems = computed<OrderedItem[]>(() => {
        const { eventSplittables, billingCurrency } = this.splitrEvent();

        const consumerTotal = (quantity: number, unitPrice: number) => {
            const total = quantity * unitPrice;
            return formatCurrency(total, billingCurrency, 2, false);
        }

        return eventSplittables.map((splittable) => ({
            id: splittable.id,
            orderName: splittable.name,
            orderQuantity: splittable.quantity,
            strategyVariant: splittable.splitStrategy,
            splitStrategy: SPLIT_STRATEGY_MAP[splittable.splitStrategy],
            unitPrice: formatCurrency(splittable.unitPrice, billingCurrency, 2, false),
            orderTotal: formatCurrency(splittable.total, billingCurrency, 2, true, true),
            orderQuantitySplits: splittable.quantitySplits.map((quantitySplit) => ({
                id: quantitySplit.id,
                consumerName: quantitySplit.consumerName,
                consumerQuantity: quantitySplit.consumerQuantity,
                consumerTotal: consumerTotal(quantitySplit.consumerQuantity, splittable.unitPrice),
            })),
        }));
    });
}

interface EventPayer {
    id: string;
    payerName: string;
    paidAmount: string;
    percentageContribution: number;
    avatar: { bg: string; fg: string };
}

interface QuantitySplit {
    id: string;
    consumerName: string;
    consumerTotal: string;
    consumerQuantity: number;
}

interface OrderedItem {
    id: string;
    unitPrice: string;
    orderName: string;
    orderTotal: string;
    orderQuantity: number;
    splitStrategy: string;
    orderQuantitySplits: QuantitySplit[];
    strategyVariant: SplitStrategyVariant;
}
