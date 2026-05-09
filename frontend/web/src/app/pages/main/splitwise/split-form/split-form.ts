import { Button } from '@atoms/button';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { SplitwiseSquad } from '@global/types';
import { Form, FormCloseEvent } from '@organisms/form';
import { SelectOption } from '@atoms/select/select.types';
import { SplitFormStep1 } from './step-1/split-form-step-1';
import { ISquadMember } from '@structural/main/squad-member/squad-member';
import { ChevronsRight, LucideAngularModule, UserPlus } from 'lucide-angular';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  SplitFormSchema,
  InitialSplitFormState,
  SplitFormValidationSchema,
} from './split-form.types';

@Component({
  selector: 'splitwise-split-form',
  templateUrl: './split-form.html',
  imports: [LucideAngularModule, Form, Button, SplitFormStep1],
})
export class SplitwiseSplitForm {
  // ICONS
  protected readonly iconSize = 18;
  protected readonly NextIcon = ChevronsRight;

  // INPUTS
  readonly squads = input.required<SplitwiseSquad[]>();
  readonly isSplitFormOpen = input.required<boolean>();

  // OUTPUTS
  readonly closeSplitFormEvent = output<boolean>();

  // SIGNAL STATES
  protected readonly splitFormStep = signal<1 | 2 | 3>(1);

  private readonly splitMembers = signal<string[]>([]);
  protected readonly selectedSquad = signal<string>('');
  protected readonly isSubmittingSplitForm = signal<boolean>(false);
  private readonly memberCheckedState = signal<Record<string, boolean>>({});
  protected readonly selectedMembers = computed<string[]>(() => {
    const checkedState = this.memberCheckedState();
    return Object.keys(checkedState).filter((member) => checkedState[member]);
  });

  // SERVICES
  private readonly toastService = inject(ToastService);

  // COMPUTED
  

  // DATA

  // FORM
  protected readonly splitFormModel = signal<SplitFormSchema>(InitialSplitFormState);
  protected readonly splitForm = form(this.splitFormModel, SplitFormValidationSchema);

  // METHODS
  protected goToNextStep(step: 1 | 2 | 3) {
    this.splitFormStep.set(step);
  }

  protected resetSplitForm() {
    this.splitForm().reset();
    this.splitFormStep.set(1);
    this.splitFormModel.set(InitialSplitFormState);
  }

  protected handleSplitFormClose(event: FormCloseEvent) {
    if (event === 'icon') this.resetSplitForm();
    this.closeSplitFormEvent.emit(false);
  }

  // SUBMISSIONS
  protected handleSplitFormSubmit(event: Event) {
    event.preventDefault();

    this.splitForm.eventMembers().controlValue.set(
      Object.entries(this.memberCheckedState())
        .filter(([_, isChecked]) => isChecked)
        .map(([memberName]) => memberName),
    );

    const { ...payload } = this.splitFormModel();
    console.log(payload);

    // this.isSubmittingSplitForm.set(true);

    // setTimeout(() => {
    //   this.isSubmittingSplitForm.set(false);
    //   this.closeSplitFormEvent.emit(true);
    // }, 2000);
  }

}
