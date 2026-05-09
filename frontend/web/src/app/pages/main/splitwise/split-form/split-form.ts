import { Input } from '@atoms/input';
import { Select } from '@atoms/select';
import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { SplitwiseSquad } from '@global/types';
import { DatePicker } from '@organisms/date-picker';
import { Form, FormCloseEvent } from '@organisms/form';
import { SelectOption } from '@atoms/select/select.types';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import { ISquadMember, SquadMember } from '@structural/main/squad-member/squad-member';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  SplitFormSchema,
  InitialSplitFormState,
  SplitFormValidationSchema,
} from './split-form.types';

@Component({
  selector: 'splitwise-split-form',
  templateUrl: './split-form.html',
  imports: [LucideAngularModule, Form, Input, Select, DatePicker, Button, NgClass, SquadMember],
})
export class SplitwiseSplitForm {
  // ICONS
  protected readonly iconSize = 18;
  protected readonly AddUserIcon = UserPlus;

  // INPUTS
  readonly squads = input.required<SplitwiseSquad[]>();
  readonly isSplitFormOpen = input.required<boolean>();

  // OUTPUTS
  readonly closeSplitFormEvent = output<boolean>();

  // SIGNAL STATES
  private readonly splitMembers = signal<string[]>([]);
  protected readonly selectedSquad = signal<string>('');
  protected readonly isSquadCustom = signal<boolean>(false);
  protected readonly isMemberNameValid = signal<boolean>(false);
  protected readonly isSubmittingSplitForm = signal<boolean>(false);
  private readonly memberCheckedState = signal<Record<string, boolean>>({});
  protected readonly selectedMembers = computed<string[]>(() => {
    const checkedState = this.memberCheckedState();
    return Object.keys(checkedState).filter((member) => checkedState[member]);
  });

  // SERVICES
  private readonly toastService = inject(ToastService);

  // COMPUTED
  protected readonly squadOptions = computed<SelectOption[]>(() => {
    const squadNames = this.squads().map((squad) => squad.squadName);
    return [...squadNames, 'CUSTOM'].map((squadName) => ({
      value: squadName,
      label: squadName === 'CUSTOM' ? 'Custom' : squadName,
    }));
  });

  protected readonly formattedSplitMembers = computed<ISquadMember[]>(() => {
    const members =
      this.selectedSquad() === 'CUSTOM'
        ? this.splitMembers()
        : this.squads().find((squad) => squad.squadName === this.selectedSquad())?.squadMembers ||
          [];

    const checkedState = this.memberCheckedState();

    return members.map((member) => ({
      memberName: member,
      isChecked: checkedState[member] ?? true,
    }));
  });

  // DATA

  // FORM
  protected readonly splitFormModel = signal<SplitFormSchema>(InitialSplitFormState);
  protected readonly splitForm = form(this.splitFormModel, SplitFormValidationSchema);

  // METHODS
  validateMemberName(memberName: string) {
    const trimmedName = memberName.trim();
    const alreadyExists = this.splitMembers()
      .map((member) => member.toLowerCase())
      .includes(trimmedName.toLowerCase());

    const isValid = trimmedName.length > 2 && trimmedName.length <= 25 && !alreadyExists;

    this.isMemberNameValid.set(isValid);
  }

  addNewMemberToPool(memberName: string) {
    const trimmedName = memberName.trim();
    const normalizedInput = trimmedName.toLowerCase();

    this.splitMembers.update((customMembers) => {
      const normalizedCustom = customMembers.map((m) => m.toLowerCase());
      const alreadyExists = normalizedCustom.includes(normalizedInput);

      if (alreadyExists) {
        this.toastService.show({
          variant: 'warning',
          title: 'Member already exists!',
          details: 'This member is already in the pool.',
        });
        return customMembers;
      }

      return [...customMembers, trimmedName];
    });

    this.memberCheckedState.update((state) => ({
      ...state,
      [trimmedName]: true,
    }));
  }

  protected toggleMemberChecked(memberName: string) {
    this.memberCheckedState.update((state) => ({
      ...state,
      [memberName]: !(state[memberName] ?? true),
    }));
  }

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

    this.splitForm.eventMembers().controlValue.set(
      Object.entries(this.memberCheckedState())
        .filter(([_, isChecked]) => isChecked)
        .map(([memberName]) => memberName)
    );

    const { ...payload } = this.splitFormModel();
    console.log(payload);
    
    // this.isSubmittingSplitForm.set(true);

    // setTimeout(() => {
    //   this.isSubmittingSplitForm.set(false);
    //   this.closeSplitFormEvent.emit(true);
    // }, 2000);
  }

  // CONSTRUCTOR
  constructor() {
    effect(() => {
      const selectedSquad = this.splitFormModel().squadName;
      this.selectedSquad.set(selectedSquad);
    });

    effect(() => {
      const squadName = this.selectedSquad();
      const isSquadCustom = squadName === 'CUSTOM';
      this.isSquadCustom.set(isSquadCustom);

      this.splitMembers.set([]);

      if (isSquadCustom) {
        this.memberCheckedState.set({});
      } else {
        const squad = this.squads().find((s) => s.squadName === squadName);
        const initialCheckedState: Record<string, boolean> = {};
        squad?.squadMembers.forEach((member) => {
          initialCheckedState[member] = true;
        });
        this.memberCheckedState.set(initialCheckedState);
      }
    });
  }
}
