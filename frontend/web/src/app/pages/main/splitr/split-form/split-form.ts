import { Button } from '@atoms/button';
import { formatFullDate } from '@libs/utils';
import { form } from '@angular/forms/signals';
import { SplitrService } from '@api/splitr.service';
import { Form, FormCloseEvent } from '@organisms/form';
import { AccountsService } from '@api/accounts.service';
import { ToastService } from '@atoms/toast/toast.service';
import { SplitFormStep1 } from './step-1/split-form-step-1';
import { SplitFormStep2 } from './step-2/split-form-step-2';
import { SplitFormStep3 } from './step-3/split-form-step-3';
import { ChevronsRight, ChevronsLeft, LucideAngularModule } from 'lucide-angular';
import { SplitrSquad, ISplitrEvent, SplittableOrder, BillPayerPayload, SplitrEventPayload } from '@global/types';
import { input, effect, inject, output, signal, computed, untracked, Component } from '@angular/core';
import { SplitFormSchema, InitialSplitFormState, SplitFormValidationSchema } from './split-form.types';

@Component({
    selector: 'splitr-split-form',
    templateUrl: './split-form.html',
    imports: [LucideAngularModule, Form, Button, SplitFormStep1, SplitFormStep2, SplitFormStep3]
})
export class SplitrSplitForm {
    // ICONS
    protected readonly iconSize = 18;
    protected readonly NextIcon = ChevronsRight;
    protected readonly PreviousIcon = ChevronsLeft;

    // INPUTS
    readonly squads = input.required<SplitrSquad[]>();
    readonly isSplitFormOpen = input.required<boolean>();

    // OUTPUTS
    readonly closeSplitFormEvent = output<boolean>();

    // SIGNAL STATES
    protected readonly customMembers = signal<string[]>([]);
    protected readonly isStep3Valid = signal<boolean>(false);
    protected readonly splitFormStep = signal<FormStepOptions>(1);
    protected readonly isSubmittingSplitForm = signal<boolean>(false);

    // SERVICES
    private readonly toastService = inject(ToastService);
    private readonly splitrService = inject(SplitrService);
    private readonly accountsService = inject(AccountsService);

    // DATA
    protected readonly defaultCurrency = this.accountsService.getDefaultCurrency();

    // COMPUTED
    protected readonly initalMemberPool = computed<string[]>(() => {
        const squadName = this.splitForm.squadName().value();

        const squad = this.squads().find((squad) => squad.squadName === squadName);

        if (!squad) return this.customMembers();
        return squad.squadMembers;
    });

    // FORM
    private initialFormState: SplitFormSchema = {
        ...InitialSplitFormState,
        billingCurrency: this.defaultCurrency
    };
    protected readonly splitFormModel = signal<SplitFormSchema>(this.initialFormState);
    protected readonly splitForm = form(this.splitFormModel, SplitFormValidationSchema);

    // METHODS
    protected formatDate = (date: Date) => formatFullDate(date.toISOString());
    protected goToNextStep = (step: FormStepOptions) => this.splitFormStep.set(step);
    protected goToPreviousStep = (step: FormStepOptions) => this.splitFormStep.set(step);
    protected resetSplitForm() {
        this.splitForm().reset();
        this.splitFormStep.set(1);
        this.customMembers.set([]);
        this.splitFormModel.set(this.initialFormState);
    }

    protected handleSplitFormClose(event: FormCloseEvent) {
        if (event === 'icon') this.resetSplitForm();
        this.closeSplitFormEvent.emit(false);
    }

    protected updateEventMembers(members: string[]) {
        const isCustomSquad = this.splitForm.squadName().value() === 'CUSTOM';
        if (isCustomSquad) this.customMembers.set(members);

        this.splitForm.eventSplittables().controlValue.set([]);
        this.splitForm.eventMembers().controlValue.set(members);
    }

    protected handleOnSplittablesChange(splittables: SplittableOrder[]) {
        this.splitForm.eventSplittables().controlValue.set(splittables);
    }

    protected handleOnStep3ValidationChange(valid: boolean) {
        const compositeValid = valid && this.splitForm.billPayers().value().length > 0;
        this.isStep3Valid.set(compositeValid);
    }

    protected handleOnBillPayersChange(billPayers: BillPayerPayload[]) {
        this.splitForm.billPayers().controlValue.set(billPayers);
    }

    private formatPayload(formData: SplitFormSchema): SplitrEventPayload {
        const { eventSplittables, eventDate, verificationTotal, ...rest } = formData;

        const cleanedSplittables = eventSplittables.map(({ id: _splittableId, quantitySplits, ...splittable }) => ({
            ...splittable,
            quantitySplits: quantitySplits.map(({ id: _quantitySplitId, ...split }) => split)
        }));

        return {
            ...rest,
            eventDate: eventDate.toISOString(),
            eventSplittables: cleanedSplittables,
            verificationTotal: verificationTotal === null ? null : Number(verificationTotal)
        } satisfies SplitrEventPayload;
    }

    // SUBMISSIONS
    protected handleSplitFormSubmit(event: Event) {
        event.preventDefault();

        const formData = this.splitForm().value();

        const splitrEventPayload = this.formatPayload(formData);

        this.isSubmittingSplitForm.set(true);

        setTimeout(() => {
            this.splitrService.createNewSplitrEvent(splitrEventPayload).subscribe({
                next: (response: ISplitrEvent) => {
                    this.toastService.show({
                        variant: 'success',
                        title: 'Splitr event created!',
                        details: `Your [${response.eventName}] event has been created successfully.`
                    });

                    this.resetSplitForm();
                    this.closeSplitFormEvent.emit(true);
                },
                complete: () => this.isSubmittingSplitForm.set(false)
            });
        }, 2000);
    }

    constructor() {
        effect(
            () => {
                const squadName = this.splitForm.squadName().value();

                untracked(() => {
                    const squadMembers =
                        this.squads().find((squad) => squad.squadName === squadName)?.squadMembers || [];

                    this.splitForm.eventMembers().controlValue.set(squadMembers);
                });
            },
            { allowSignalWrites: false }
        );
    }
}

type FormStepOptions = 1 | 2 | 3;
