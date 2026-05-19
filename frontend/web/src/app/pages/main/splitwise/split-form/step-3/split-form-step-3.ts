import { Input } from '@atoms/input';
import { Select } from '@atoms/select';
import { NgClass } from '@angular/common';
import { formatCurrency } from '@libs/utils';
import { AuthService } from '@api/auth.service';
import { FieldTree } from '@angular/forms/signals';
import { SplitFormSchema } from '../split-form.types';
import { PayerInput } from './payer-input/payer-input';
import { SelectOption } from '@atoms/select/select.types';
import { LucideAngularModule, Check, X } from 'lucide-angular';
import { ISquadMember, SquadMember } from '@structural/main/squad-member/squad-member';
import {
    Component,
    computed,
    effect,
    inject,
    input,
    output,
    signal,
    untracked,
} from '@angular/core';
import {
    BillPayer,
    PaymentOption,
    PAYMENT_OPTIONS,
    PAYMENT_OPTIONS_MAP,
} from './split-form-step-3.types';

@Component({
    selector: 'split-form-step-3',
    templateUrl: './split-form-step-3.html',
    imports: [LucideAngularModule, NgClass, Input, Select, SquadMember, PayerInput],
})
export class SplitFormStep3 {
    // ICONS
    protected readonly CrossIcon = X;
    protected readonly CheckIcon = Check;

    // INPUTS
    readonly iconSize = input.required<number>();
    readonly presentMembers = input.required<string[]>();
    readonly formModel = input.required<FieldTree<SplitFormSchema, string | number>>();

    // OUTPUTS
    readonly onValidationChangeEvent = output<boolean>();

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
    protected readonly totalsEqual = computed<boolean>(
        () =>
            Math.abs(this.billSubtotal() - (this.formModel().verificationTotal().value() ?? 0)) <
            0.01,
    );
    protected readonly formattedBillSubtotal = computed(() => {
        return formatCurrency(
            this.billSubtotal(),
            this.formModel().billingCurrency().value(),
            2,
            true,
        );
    });
    protected readonly remainingPayableAmount = computed<number>(
        () =>
            this.billSubtotal() -
            this.billPayerList().reduce((acc, payer) => acc + payer.amount, 0),
    );
    protected readonly formattedRemainingPayableAmount = computed(() =>
        formatCurrency(
            this.remainingPayableAmount(),
            this.formModel().billingCurrency().value(),
            2,
            true,
        ),
    );
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
                    this.billPayerList.update((current) => [
                        ...current.map((payer) => ({
                            ...payer,
                            amount: newEqualAmount,
                        })),
                        newPayer,
                    ]);
                    break;
                }
                case 'custom' as PaymentOption: {
                    const newPayer: BillPayer = {
                        name: memberName,
                        amount: 0,
                    };
                    this.billPayerList.update((current) => [...current, newPayer]);
                    break;
                }
                default:
                    break;
            }
        }
    }

    protected handlePayerAmountChange(payer: BillPayer) {
        this.billPayerList.update((current) =>
            current.map((existing) =>
                existing.name === payer.name ? { ...existing, amount: payer.amount } : existing,
            ),
        );
    }

    protected handleRemovePayer(payerName: string) {
        this.billPayerList.update((current) => current.filter((payer) => payer.name !== payerName));
    }

    // HELPER FUNCTIONS
    private calculateEqualPayableAmount() {
        if (this.billPayerList().length === 0) return this.billSubtotal();
        const equalAmount = this.billSubtotal() / (this.billPayerList().length + 1);
        return Math.round(equalAmount * 100) / 100;
    }

    constructor() {
        effect(() => {
            const isValid = this.totalsEqual() && this.billPayerList().length > 0;
            this.onValidationChangeEvent.emit(isValid);
        });

        effect(() => {
            const paymentStrategy = this.formModel().billPayerStrategy().value();

            untracked(() => {
                const currentPayers = this.billPayerList();
                const subtotal = this.billSubtotal();

                switch (paymentStrategy) {
                    case 'one' as PaymentOption: {
                        if (currentPayers.length === 0) return;

                        if (currentPayers.length > 1) {
                            this.billPayerList.set([]);
                            return;
                        }

                        const solePayer = currentPayers[0];
                        this.billPayerList.set([{ name: solePayer.name, amount: subtotal }]);
                        break;
                    }
                    case 'equal' as PaymentOption: {
                        if (currentPayers.length === 0) return;

                        const equalAmount = this.calculateEqualPayableAmount();

                        this.billPayerList.update((current) =>
                            current.map((payer) => ({ ...payer, amount: equalAmount })),
                        );
                        break;
                    }
                    case 'custom' as PaymentOption: {
                        this.billPayerList.set(
                            currentPayers.map((payer) => ({ ...payer, amount: 0 })),
                        );
                        break;
                    }
                    default:
                        break;
                }
            });
        });
    }
}
