import { Badge } from '@atoms/badge';
import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { formatCurrency, formatFullDate } from '@libs/utils';
import { ISplitrEvent, SPLIT_STRATEGY_MAP } from '@global/types';
import { LucideAngularModule, Calendar1, Users } from 'lucide-angular';
import { EventPayer, OrderedItem, Settlement } from './splitr-breakdown.types';
import { buildAvatarMap, buildParticipantsMap, calculateSettlments } from './splitr-breakdown.utils';

@Component({
    selector: 'splitr-breakdown',
    templateUrl: './splitr-breakdown.html',
    imports: [LucideAngularModule, Badge, NgClass],
    styles: `
        @reference "tailwindcss";

        lucide-icon {
            @apply text-(--primary);
        }

        .section {
            @apply flex flex-col gap-2;

            .section-title {
                @apply font-bold uppercase text-(--primary-text);
            }
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
            avatar: buildAvatarMap(billPayer.payerName),
            paidAmount: formatCurrency(billPayer.payerAmount, billingCurrency, 2, true),
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
        };

        return eventSplittables.map((splittable) => ({
            id: splittable.id,
            orderName: splittable.name,
            orderQuantity: splittable.quantity,
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

    protected readonly settlements = computed<Settlement[]>(() => {
        const { billingCurrency } = this.splitrEvent();
        const participants = buildParticipantsMap(this.splitrEvent());
        return calculateSettlments(participants, billingCurrency);
    });
}
