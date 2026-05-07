import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { form } from '@angular/forms/signals';
import { Form, FormCloseEvent } from '@organisms/form';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import { Component, computed, input, output, signal } from '@angular/core';
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

  // STATE SIGNALS
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

    const localMembers = selectedMembers.map((member) => ({
      memberName: member,
      isChecked: true,
    }));

    return [...selectedExisitingMembers, ...localMembers];
  });

  // METHODS
  addNewMemberToPool(newMember: string) {
    console.log('Add new member to pool', newMember);
    this.selectedSquadMembers.update((members) => [...members, newMember]);
  }

  resetCreateSquadForm() {
    this.selectedSquadMembers.set([]);
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
