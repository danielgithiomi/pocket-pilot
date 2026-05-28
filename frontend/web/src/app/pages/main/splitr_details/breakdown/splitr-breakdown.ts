import { Badge } from '@atoms/badge';
import { ISplitrEvent } from '@global/types';
import { formatCurrency, formatFullDate, hashFromName } from '@libs/utils';
import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, Calendar1, Users } from 'lucide-angular';
import { applyWhenValue } from '@angular/forms/signals';
import { COLOR_PALETTE } from '@libs/constants';
import { NgClass } from '@angular/common';

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
}

interface EventPayer {
    id: string;
    payerName: string;
    paidAmount: string;
    percentageContribution: number;
    avatar: { bg: string; fg: string };
}
