import { Component, computed, input } from '@angular/core';

@Component({
    selector: 'payer-input',
    template: ``,
})
export class PayerInput {
    // INPUT
    readonly payerName = input.required<string>();

    // COMPUTED
    protected readonly initial = computed(() => this.payerName().substring(0, 1).toUpperCase());
}
