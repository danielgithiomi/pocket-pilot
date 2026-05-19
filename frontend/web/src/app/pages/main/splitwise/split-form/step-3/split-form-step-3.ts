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
import { PAYMENT_OPTIONS, PAYMENT_OPTIONS_MAP, PaymentOption } from './split-form-step-3.types';

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
    protected readonly billPayerList = signal<string[]>([]);

    // SERVICES
    private readonly authService = inject(AuthService);

    // COMPUTED
    protected readonly canAddPayerToList = computed<boolean>(() => {
        return this.billPayerList().length < this.presentMembers().length;
    });
    protected readonly isCustomPaymentStrategy = computed<boolean>(
        () => this.formModel().billPayerStrategy().value() === ('custom' as PaymentOption),
    );
    protected readonly formattedBillSubtotal = computed(() => {
        const splittables = this.formModel().splittables().value();
        const currency = this.formModel().billingCurrency().value();
        const subtotal = splittables.reduce((acc, splittable) => acc + splittable.total, 0);

        return formatCurrency(subtotal, currency, 2, true);
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
            isChecked: this.billPayerList().includes(member),
        }));
    });

    // METHODS
    protected handleAddMemberToPayerList(memberName: string) {
        // Check payment strategy
        const paymentStrategy = this.formModel().billPayerStrategy().value();

        const isPresent = this.billPayerList().includes(memberName);

        if (isPresent)
            this.billPayerList.update((current) => current.filter((m) => m !== memberName));
        else {
            if (paymentStrategy === ('one' as PaymentOption)) {
                this.billPayerList.set([memberName]);
            } else {
                this.billPayerList.update((current) => [...current, memberName]);
            }
        }
    }
}
