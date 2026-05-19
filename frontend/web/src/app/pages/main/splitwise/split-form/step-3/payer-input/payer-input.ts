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

    // COMPUTED
    protected readonly initial = computed(() => this.payer().name.substring(0, 1).toUpperCase());

    // METHODS
    protected handlePayerAmountChange(value: string) {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) return;

        console.log(numericValue);
    }
}
