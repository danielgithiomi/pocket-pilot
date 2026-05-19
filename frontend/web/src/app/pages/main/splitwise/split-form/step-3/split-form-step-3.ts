import { Input } from '@atoms/input';
import { Select } from '@atoms/select';
import { formatCurrency } from '@libs/utils';
import { AuthService } from '@api/auth.service';
import { FieldTree } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { SplitFormSchema } from '../split-form.types';
import { PayerInput } from './payer-input/payer-input';
import { SelectOption } from '@atoms/select/select.types';
import { Component, computed, inject, input, signal } from '@angular/core';
import { ISquadMember, SquadMember } from '@structural/main/squad-member/squad-member';
import {
    BillPayer,
    PAYMENT_OPTIONS,
    PAYMENT_OPTIONS_MAP,
    PaymentOption,
} from './split-form-step-3.types';

@Component({
    selector: 'split-form-step-3',
    templateUrl: './split-form-step-3.html',
    imports: [LucideAngularModule, Input, Select, SquadMember, PayerInput],
})
export class SplitFormStep3 {
    // INPUTS
    readonly iconSize = input.required<number>();
    readonly presentMembers = input.required<string[]>();
    readonly formModel = input.required<FieldTree<SplitFormSchema, string | number>>();

    // STATE SIGNALS
    protected readonly billPayerList = signal<BillPayer[]>([]);

    // SERVICES
    private readonly authService = inject(AuthService);

    // COMPUTED
    protected readonly canAddPayerToList = computed<boolean>(() => {
        return this.billPayerList().length < this.presentMembers().length;
    });
    protected readonly isCustomPaymentStrategy = computed<boolean>(
        () => this.formModel().billPayerStrategy().value() === ('custom' as PaymentOption),
    );
    protected readonly billPayerListNames = computed<string[]>(() => {
        return this.billPayerList().map((p) => p.name);
    });
    protected readonly billSubtotal = computed<number>(() => {
        return this.formModel()
            .splittables()
            .value()
            .reduce((acc, splittable) => acc + splittable.total, 0);
    });
    protected readonly formattedBillSubtotal = computed(() => {
        return formatCurrency(
            this.billSubtotal(),
            this.formModel().billingCurrency().value(),
            2,
            true,
        );
    });
    protected readonly billPaymentStrategyOptions = computed<SelectOption[]>(() => {
        return PAYMENT_OPTIONS.map((option) => ({
            value: option,
            label: PAYMENT_OPTIONS_MAP[option],
        }));
    });
    protected readonly billPayerOptions = computed<ISquadMember[]>(() => {
        const firstName = this.authService.user()?.name.split(' ')[0];
        const allMembers = [`${firstName}(Self)`, ...this.presentMembers()];

        return allMembers.map((member) => ({
            memberName: member,
            isChecked: this.billPayerListNames().includes(member),
        }));
    });

    // METHODS
    protected handleAddMemberToPayerList(memberName: string) {
        const isPresent = this.billPayerListNames().includes(memberName);

        if (isPresent)
            this.billPayerList.update((current) =>
                current.filter((payer) => payer.name !== memberName),
            );
        else {
            const paymentStrategy = this.formModel().billPayerStrategy().value();
            switch (paymentStrategy) {
                case 'one' as PaymentOption: {
                    const newPayer: BillPayer = {
                        name: memberName,
                        amount: this.billSubtotal(),
                    };
                    this.billPayerList.set([newPayer]);
                    break;
                }
                case 'equal' as PaymentOption: {
                    const newEqualAmount = this.calculateEqualPayableAmount();
                    const newPayer: BillPayer = {
                        name: memberName,
                        amount: newEqualAmount,
                    };
                    this.billPayerList.update((current) => [...current, newPayer]);
                    break;
                }
                case 'custom' as PaymentOption: {
                    const newPayer: BillPayer = {
                        name: memberName,
                        amount: this.formModel().verificationTotal().value() ?? 0,
                    };
                    this.billPayerList.update((current) => [...current, newPayer]);
                    break;
                }
                default:
                    break;
            }
        }
    }

    protected handleRemovePayer(payerName: string) {
        this.billPayerList.update((current) => current.filter((payer) => payer.name !== payerName));
    }

    // HELPER FUNCTIONS
    private calculateEqualPayableAmount() {
        if (this.billPayerList().length === 0) return this.billSubtotal();
        const equalAmount = this.billSubtotal() / (this.billPayerList().length + 1);
        const roundedAmount = Math.round(equalAmount * 100) / 100;
        return roundedAmount;
    }
}
