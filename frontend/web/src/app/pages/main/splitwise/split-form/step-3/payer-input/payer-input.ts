import { LucideAngularModule } from 'lucide-angular';
import { AccountsService } from '@api/accounts.service';
import { Component, computed, inject, input } from '@angular/core';

@Component({
    imports: [LucideAngularModule],
    selector: 'payer-input',
    templateUrl: './payer-input.html',
})
export class PayerInput {
    // INPUT
    readonly payer = input.required<string>();

    // COMPUTED
    protected readonly initial = computed(() => this.payer().substring(0, 1).toUpperCase());

    // SERVICES
    private readonly accountsService = inject(AccountsService);

    // DATA
    protected readonly defaultCurrency = this.accountsService.getDefaultCurrency();

    // METHODS
    protected handlePayerAmountChange(value: string) {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) return;

        console.log(numericValue);
    }
}
