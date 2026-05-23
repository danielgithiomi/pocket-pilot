import { Button } from '@atoms/button';
import { formatFullDate } from '@libs/utils';
import { form } from '@angular/forms/signals';
import { Form, FormCloseEvent } from '@organisms/form';
import { AccountsService } from '@api/accounts.service';
import { SplitFormStep1 } from './step-1/split-form-step-1';
import { SplitFormStep2 } from './step-2/split-form-step-2';
import { SplitFormStep3 } from './step-3/split-form-step-3';
import { SplittableOrder, SplitwiseSquad, BillPayer } from '@global/types';
import { ChevronsRight, ChevronsLeft, LucideAngularModule } from 'lucide-angular';
import {
    input,
    effect,
    inject,
    output,
    signal,
    computed,
    untracked,
    Component,
} from '@angular/core';
import {
    SplitFormSchema,
    InitialSplitFormState,
    SplitFormValidationSchema,
} from './split-form.types';

@Component({
    selector: 'splitwise-split-form',
    templateUrl: './split-form.html',
    imports: [LucideAngularModule, Form, Button, SplitFormStep1, SplitFormStep2, SplitFormStep3],
})
export class SplitwiseSplitForm {
    // ICONS
    protected readonly iconSize = 18;
    protected readonly NextIcon = ChevronsRight;
    protected readonly PreviousIcon = ChevronsLeft;

    // INPUTS
    readonly squads = input.required<SplitwiseSquad[]>();
    readonly isSplitFormOpen = input.required<boolean>();

    // OUTPUTS
    readonly closeSplitFormEvent = output<boolean>();

    // SIGNAL STATES
    protected readonly customMembers = signal<string[]>([]);
    protected readonly isStep3Valid = signal<boolean>(false);
    protected readonly splitFormStep = signal<FormStepOptions>(1);
    protected readonly isSubmittingSplitForm = signal<boolean>(false);

    // SERVICES
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
        billingCurrency: this.defaultCurrency,
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

        this.splitForm.splittables().controlValue.set([]);
        this.splitForm.eventMembers().controlValue.set(members);
    }

    protected handleOnSplittablesChange(splittables: SplittableOrder[]) {
        this.splitForm.splittables().controlValue.set(splittables);
    }

    protected handleOnStep3ValidationChange(valid: boolean) {
        const compositeValid = valid && this.splitForm.billPayers().value().length > 0;
        this.isStep3Valid.set(compositeValid);
    }

    protected handleOnBillPayersChange(billPayers: BillPayer[]) {
        this.splitForm.billPayers().controlValue.set(billPayers);
    }

    // SUBMISSIONS
    protected handleSplitFormSubmit(event: Event) {
        event.preventDefault();

        const formData = this.splitForm().value();
        console.log(formData);

        this.isSubmittingSplitForm.set(true);

        setTimeout(() => {
            // this.closeSplitFormEvent.emit(true);
            this.isSubmittingSplitForm.set(false);
        }, 2000);
    }

    constructor() {
        effect(() => {
            const squadName = this.splitForm.squadName().value();

            const squadMembers =
                this.squads().find((squad) => squad.squadName === squadName)?.squadMembers || [];

            untracked(() => this.splitForm.eventMembers().controlValue.set(squadMembers));
        });
    }
}

type FormStepOptions = 1 | 2 | 3;
