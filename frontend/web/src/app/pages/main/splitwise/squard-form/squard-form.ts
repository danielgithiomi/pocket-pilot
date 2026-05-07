import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { Form, FormCloseEvent } from '@organisms/form';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { SquadMember, ISquadMember } from '@structural/main/squad-member/squad-member';
import {
  CreateSquadSchema,
  initialCreateSquadData,
  createSquadValidationSchema,
} from './squad-form.types';

@Component({
  selector: 'splitwise-squard-form',
  templateUrl: './squard-form.html',
  imports: [LucideAngularModule, Form, Button, Input, SquadMember, NgClass],
})
export class SplitwiseSquardForm {
  // ICONS
  protected readonly iconSize: number = 18;
  protected readonly AddUserIcon = UserPlus;

  // INPUTS
  readonly existingSquadMembers = input.required<string[]>();

  // OUTPUTS
  readonly closeCreateFormSquadEvent = output<void>();

  // SERVICES
  private readonly toastService = inject(ToastService);

  // STATE SIGNALS
  protected readonly isMemberNameValid = signal<boolean>(false);
  protected readonly selectedSquadMembers = signal<string[]>([]);
  protected readonly isSubmittingCreateSquadForm = signal<boolean>(false);

  // FORM
  protected readonly createSquadFormModel = signal<CreateSquadSchema>(initialCreateSquadData);
  protected readonly createSquadForm = form(this.createSquadFormModel, createSquadValidationSchema);

  // COMPUTED
  protected readonly formattedExistingMembers = computed<ISquadMember[]>(() =>
    this.existingSquadMembers().map((member) => ({
      memberName: member,
      isChecked: this.selectedSquadMembers().includes(member),
    })),
  );

  protected readonly squadMembersPool = computed<ISquadMember[]>(() => {
    const selectedMembers = this.selectedSquadMembers();
    const selectedExisitingMembers = this.formattedExistingMembers();

    const existingMemberNames = new Set(this.existingSquadMembers().map((m) => m.toLowerCase()));
    const localMembers = selectedMembers
      .filter((member) => !existingMemberNames.has(member.toLowerCase()))
      .map((member) => ({
        memberName: member,
        isChecked: true,
      }));

    return [...selectedExisitingMembers, ...localMembers];
  });

  // METHODS
  validateMemberName(memberName: string) {
    const allMemberNames = this.squadMembersPool()
      .flatMap((member) => member.memberName)
      .map((name) => name.toLowerCase());

    const trimmedName = memberName.trim();
    const isValid =
      trimmedName.length > 2 &&
      trimmedName.length <= 25 &&
      !allMemberNames.includes(trimmedName.toLowerCase());

    this.isMemberNameValid.set(isValid);
  }

  addNewMemberToPool(memberName: string) {
    const trimmedName = memberName.trim();
    const normalizedInput = trimmedName.toLowerCase();

    const existingMemberNames = this.existingSquadMembers().map((m) => m.toLowerCase());

    const isExistingMember = existingMemberNames.includes(normalizedInput);

    this.selectedSquadMembers.update((selectedMembers) => {
      const normalizedSelected = selectedMembers.map((m) => m.toLowerCase());
      const isAlreadySelected = normalizedSelected.includes(normalizedInput);

      if (isAlreadySelected)
        return selectedMembers.filter((m) => m.toLowerCase() !== normalizedInput);

      if (!isExistingMember) {
        const allPoolNames = this.squadMembersPool().map((m) => m.memberName.toLowerCase());
        if (allPoolNames.includes(normalizedInput)) {
          this.toastService.show({
            variant: 'warning',
            title: 'Member already exists',
          });
          return selectedMembers;
        }
      }

      return [...selectedMembers, trimmedName];
    });
  }

  resetCreateSquadForm() {
    this.selectedSquadMembers.set([]);
    this.isMemberNameValid.set(false);
    console.log('Reset create squad form');
  }

  handleCreateSquadFormClose(event: FormCloseEvent) {
    if (event === 'icon') this.resetCreateSquadForm();
    this.closeCreateFormSquadEvent.emit();
  }

  handleCreateSquadFormSubmit(event: Event) {
    event.preventDefault();
    console.log('Create squad form submitted');
  }
}
