import { ISplitrEvent } from '@global/types';
import { formatCurrency } from '@libs/utils';
import { Component, computed, input } from '@angular/core';
import { ConsumerSummary, IConsumerSummary } from './consumer_summary/consumer-summary';

@Component({
    selector: 'splitr-summary',
    imports: [ConsumerSummary],
    templateUrl: './splitr-summary.html'
})
export class SplitrSummary {
    // INPUTS
    readonly splitrEvent = input.required<ISplitrEvent>();

    // COMPUTED
    protected readonly formattedGrandTotal = computed(() => {
        const { verificationTotal, billingCurrency } = this.splitrEvent();
        return formatCurrency(verificationTotal, billingCurrency, 2, true, true);
    });

    protected readonly consumerSummaries = computed<IConsumerSummary[]>(() => {
        const { eventMembers, eventSplittables } = this.splitrEvent();

        const memberTotalAmount = (member: string) =>
            eventSplittables.reduce(
                (acc, splittable) =>
                    acc +
                    splittable.quantitySplits
                        .filter((quantitySplit) => quantitySplit.consumerName === member)
                        .reduce((acc, quantitySplit) => acc + splittable.unitPrice * quantitySplit.consumerQuantity, 0),
                0
            );

        const totalItemsConsumed = (payer: string) =>
            eventSplittables.reduce(
                (acc, splittable) =>
                    acc +
                    splittable.quantitySplits
                        .filter((quantitySplit) => quantitySplit.consumerName === payer)
                        .reduce((acc, quantitySplit) => acc + quantitySplit.consumerQuantity, 0),
                0
            );

        return eventMembers.map((member) => ({
            isSettled: false,
            consumerName: member,
            amountPayable: memberTotalAmount(member),
            itemsConsumed: totalItemsConsumed(member)
        }));
    });
}
