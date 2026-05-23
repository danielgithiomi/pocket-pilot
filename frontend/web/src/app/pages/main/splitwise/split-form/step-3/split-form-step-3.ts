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
import { input, effect, inject, output, computed, untracked, Component } from '@angular/core';
import {
    BillPayer,
    PaymentStrategyVariant,
    PAYMENT_OPTIONS,
    PAYMENT_OPTIONS_MAP,
} from '@global/types';

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
    readonly billPayerList = input.required<BillPayer[]>();
    readonly formModel = input.required<FieldTree<SplitFormSchema, string | number>>();

    // OUTPUTS
    readonly onValidationChangeEvent = output<boolean>();
    readonly onBillPayersChangeEvent = output<BillPayer[]>();

    // STATE SIGNALS
    // protected readonly billPayerList = signal<BillPayer[]>([]);

    // SERVICES
    private readonly authService = inject(AuthService);

    // COMPUTED
    protected readonly canAddPayerToList = computed<boolean>(() => {
        return this.billPayerList().length < this.presentMembers().length;
    });
    protected readonly isCustomPaymentStrategy = computed<boolean>(
        () => this.formModel().billPayerStrategy().value() === ('custom' as PaymentStrategyVariant),
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

        if (isPresent) {
            const newPayerList = this.billPayerList().filter((payer) => payer.name !== memberName);
            this.onBillPayersChangeEvent.emit(newPayerList);
        } else {
            const paymentStrategy = this.formModel().billPayerStrategy().value();
            switch (paymentStrategy) {
                case 'ONE' as PaymentStrategyVariant: {
                    const newPayer: BillPayer = {
                        name: memberName,
                        amount: this.billSubtotal(),
                    };
                    this.onBillPayersChangeEvent.emit([newPayer]);
                    break;
                }
                case 'EQUAL' as PaymentStrategyVariant: {
                    const newEqualAmount = this.calculateEqualPayableAmount();
                    const newPayer: BillPayer = {
                        name: memberName,
                        amount: newEqualAmount,
                    };
                    const newPayerList = this.billPayerList().map((payer) => ({
                        ...payer,
                        amount: newEqualAmount,
                    }));

                    this.onBillPayersChangeEvent.emit([newPayer, ...newPayerList]);
                    break;
                }
                case 'CUSTOM' as PaymentStrategyVariant: {
                    const newPayer: BillPayer = {
                        name: memberName,
                        amount: 0,
                    };
                    const newPayerList = [newPayer, ...this.billPayerList()];
                    this.onBillPayersChangeEvent.emit(newPayerList);
                    break;
                }
                default:
                    break;
            }
        }
    }

    protected handlePayerAmountChange(payer: BillPayer) {
        const newPayerList = this.billPayerList().map((existing) =>
            existing.name === payer.name ? { ...existing, amount: payer.amount } : existing,
        );

        this.onBillPayersChangeEvent.emit(newPayerList);
    }

    protected handleRemovePayer(payerName: string) {
        const newPayerList = this.billPayerList().filter((payer) => payer.name !== payerName);
        this.onBillPayersChangeEvent.emit(newPayerList);
    }

    // HELPER FUNCTIONS
    private calculateEqualPayableAmount() {
        if (this.billPayerList().length === 0) return this.billSubtotal();
        const equalAmount = this.billSubtotal() / (this.billPayerList().length + 1);
        return Math.round(equalAmount * 100) / 100;
    }

    constructor() {
        effect(() => {
            const isValid = this.totalsEqual() && Math.abs(this.remainingPayableAmount()) <= 0.01;
            this.onValidationChangeEvent.emit(isValid);
        });

        effect(() => {
            const paymentStrategy = this.formModel().billPayerStrategy().value();

            untracked(() => {
                const subtotal = this.billSubtotal();
                const currentPayers = this.billPayerList();

                switch (paymentStrategy) {
                    case 'ONE' as PaymentStrategyVariant: {
                        if (currentPayers.length === 0) return;

                        if (currentPayers.length > 1) {
                            this.onBillPayersChangeEvent.emit([]);
                            return;
                        }

                        const solePayer = currentPayers[0];
                        this.onBillPayersChangeEvent.emit([
                            { name: solePayer.name, amount: subtotal },
                        ]);
                        break;
                    }
                    case 'EQUAL' as PaymentStrategyVariant: {
                        if (currentPayers.length === 0) return;

                        const equalAmount = this.billSubtotal() / this.billPayerList().length;
                        const roundedEqualAmount = Math.round(equalAmount * 100) / 100;

                        const newPayerList = this.billPayerList().map((payer) => ({
                            ...payer,
                            amount: roundedEqualAmount,
                        }));
                        this.onBillPayersChangeEvent.emit(newPayerList);

                        break;
                    }
                    case 'CUSTOM': {
                        if (currentPayers.length === 0) return;

                        this.onBillPayersChangeEvent.emit(
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
