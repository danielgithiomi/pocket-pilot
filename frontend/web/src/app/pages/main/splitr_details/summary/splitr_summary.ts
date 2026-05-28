import { ISplitrEvent } from '@global/types';
import { formatCurrency } from '@libs/utils';
import { Component, computed, input } from '@angular/core';

@Component({
    selector: 'splitr-summary',
    templateUrl: './splitr_summary.html',
})
export class SplitrSummary {
    // INPUTS
    readonly splitrEvent = input.required<ISplitrEvent>();

    // COMPUTED
    protected readonly formattedGrandTotal = computed(() => {
        const { verificationTotal, billingCurrency } = this.splitrEvent();
        return formatCurrency(verificationTotal, billingCurrency, 2, true, false);
    });

    protected readonly consumerSummaries = computed<PayerSummary[]>(() => {
        const { eventMembers, eventSplittables } = this.splitrEvent();

        const memberTotalAmount = (member: string) =>
            eventSplittables.reduce(
                (acc, splittable) =>
                    acc +
                    splittable.quantitySplits
                        .filter((quantitySplit) => quantitySplit.consumerName === member)
                        .reduce(
                            (acc, quantitySplit) =>
                                acc + splittable.unitPrice * quantitySplit.consumerQuantity,
                            0,
                        ),
                0,
            );

        const totalItemsConsumed = (payer: string) =>
            eventSplittables.reduce(
                (acc, splittable) =>
                    acc +
                    splittable.quantitySplits
                        .filter((quantitySplit) => quantitySplit.consumerName === payer)
                        .reduce((acc, quantitySplit) => acc + quantitySplit.consumerQuantity, 0),
                0,
            );

        return eventMembers.map((member) => ({
            isSettled: false,
            payerName: member,
            payerAmount: memberTotalAmount(member),
            itemsConsumed: totalItemsConsumed(member),
        }));
    });
}

// INTERFACES
interface PayerSummary {
    payerName: string;
    isSettled: boolean;
    payerAmount: number;
    itemsConsumed: number;
}
