import { LucideAngularModule, Trash2 } from 'lucide-angular';
import { Component, computed, input, output } from '@angular/core';
import { BillPayer } from '../split-form-step-3.types';

@Component({
    imports: [LucideAngularModule],
    selector: 'payer-input',
    templateUrl: './payer-input.html',
})
export class PayerInput {
    // ICONS
    protected readonly iconSize = 16;
    protected readonly DeleteIcon = Trash2;

    // INPUT
    readonly payer = input.required<BillPayer>();
    readonly billingCurrency = input.required<string>();

    // OUTPUT
    readonly onRemovePayerEvent = output<string>();
    readonly onPayerAmountChangeEvent = output<BillPayer>();

    // COMPUTED
    protected readonly initial = computed(() => this.payer().name.substring(0, 1).toUpperCase());

    // METHODS
    protected handlePayerAmountChange(value: string) {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) return;

        const formattedAmount = Math.round(numericValue * 100) / 100;
        console.log(formattedAmount);

        const payer: BillPayer = {
            name: this.payer().name,
            amount: formattedAmount,
        };
        this.onPayerAmountChangeEvent.emit(payer);
    }
}
