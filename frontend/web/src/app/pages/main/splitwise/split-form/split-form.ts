import { Input } from '@atoms/input';
import { Select } from '@atoms/select';
import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { form } from '@angular/forms/signals';
import { SplitwiseSquad } from '@global/types';
import { Form, FormCloseEvent } from '@organisms/form';
import { SelectOption } from '@atoms/select/select.types';
import { ISquadMember, SquadMember } from '@structural/main/squad-member/squad-member';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import {
  SplitFormSchema,
  InitialSplitFormState,
  SplitFormValidationSchema,
} from './split-form.types';

@Component({
  selector: 'splitwise-split-form',
  templateUrl: './split-form.html',
  imports: [Form, Input, Select, Button, NgClass, SquadMember],
})
export class SplitwiseSplitForm {
  // INPUTS
  readonly squads = input.required<SplitwiseSquad[]>();
  readonly isSplitFormOpen = input.required<boolean>();

  // OUTPUTS
  readonly closeSplitFormEvent = output<boolean>();

  // SIGNAL STATES
  protected readonly selectedSquad = signal<string>('');
  protected readonly isSubmittingSplitForm = signal<boolean>(false);

  // COMPUTED
  protected readonly squadOptions = computed<SelectOption[]>(() => {
    const squadNames = this.squads().map((squad) => squad.squadName);
    return [...squadNames, 'CUSTOM'].map((squadName) => ({
      value: squadName,
      label: squadName === 'CUSTOM' ? 'Custom' : squadName,
    }));
  });

  protected readonly splitMembers = computed(() => {
    return this.selectedSquad() === 'custom'
      ? []
      : this.squads().find((squad) => squad.squadName === this.selectedSquad())?.squadMembers || [];
  });

  protected readonly formattedSplitMembers = computed<ISquadMember[]>(() =>
    this.splitMembers().map((member) => ({
      memberName: member,
      isChecked: false,
    })),
  );

  // DATA

  // FORM
  protected readonly splitFormModel = signal<SplitFormSchema>(InitialSplitFormState);
  protected readonly splitForm = form(this.splitFormModel, SplitFormValidationSchema);

  // METHODS
  protected resetSplitForm() {
    this.splitForm().reset();
    this.splitFormModel.set(InitialSplitFormState);
  }

  protected handleSplitFormClose(event: FormCloseEvent) {
    if (event === 'icon') this.resetSplitForm();
    this.closeSplitFormEvent.emit(false);
  }

  // SUBMISSIONS
  protected handleSplitFormSubmit(event: Event) {
    event.preventDefault();
    // TODO: Implement split form submission logic
  }

  // CONSTRUCTOR
  constructor() {
    effect(() => {
      const selectedSquad = this.splitFormModel().squadName;
      this.selectedSquad.set(selectedSquad);
    });
  }
}
