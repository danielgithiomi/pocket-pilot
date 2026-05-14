import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { Select } from '@atoms/select';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { SelectOption } from '@atoms/select';
import { SplitwiseSquad } from '@global/types';
import { FieldTree } from '@angular/forms/signals';
import { DatePicker } from '@organisms/date-picker';
import { COMMON_CURRENCIES } from '@global/constants';
import { SplitFormSchema } from '../split-form.types';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import { ISquadMember, SquadMember } from '@structural/main/squad-member/squad-member';
import {
  input,
  effect,
  inject,
  output,
  signal,
  computed,
  Component,
  untracked,
} from '@angular/core';

@Component({
  selector: 'split-form-step-1',
  templateUrl: './split-form-step-1.html',
  imports: [LucideAngularModule, NgClass, Button, Select, Input, DatePicker, SquadMember],
})
export class SplitFormStep1 {
  // ICONS
  protected readonly AddUserIcon = UserPlus;

  // INPUTS
  readonly iconSize = input.required<number>();
  readonly isSubmittingForm = input.required<boolean>();
  readonly existingSquads = input.required<SplitwiseSquad[]>();
  readonly formModel = input.required<FieldTree<SplitFormSchema, string | number>>();

  // OUTPUTS
  readonly onPresentMembersChangeEvent = output<string[]>();

  // SERVICES
  private readonly toastService = inject(ToastService);

  // DATA
  protected readonly maxDate = new Date();
  protected readonly currencies = COMMON_CURRENCIES;

  // INTERNAL STATE
  protected readonly splitMembers = signal<string[]>([]);
  protected readonly isSquadCustom = signal<boolean>(false);
  protected readonly isMemberNameValid = signal<boolean>(false);

  /** Used so remounting step 1 (e.g. back from step 2) is not treated as a squad change. */
  private previousSquadName: string | null = null;

  // COMPUTED
  protected readonly squadDropdownOptions = computed<SelectOption[]>(() => {
    const squadNames = this.existingSquads().map((squad) => squad.squadName);
    return [...squadNames, 'CUSTOM'].map((squadName) => ({
      value: squadName,
      label: squadName === 'CUSTOM' ? 'Custom' : squadName,
    }));
  });
  protected readonly formattedSplitMembers = computed<ISquadMember[]>(() => {
    const squadName = this.formModel().squadName().value();
    const members =
      squadName === 'CUSTOM'
        ? this.splitMembers()
        : (this.existingSquads().find((squad) => squad.squadName === squadName)?.squadMembers ??
          []);

    const selectedMembers = this.formModel().eventMembers().value();

    return members.map((member) => ({
      memberName: member,
      isChecked: selectedMembers.includes(member),
    }));
  });

  // METHODS
  protected validateMemberName(memberName: string) {
    const trimmedName = memberName.trim();
    const alreadyExists = this.splitMembers()
      .map((member) => member.toLowerCase())
      .includes(trimmedName.toLowerCase());

    const isNameValid = trimmedName.length > 1 && trimmedName.length <= 20 && !alreadyExists;

    this.isMemberNameValid.set(!!isNameValid);
  }

  protected addNewMemberToPool(memberName: string) {
    const trimmedName = memberName.trim();
    const normalizedInput = trimmedName.toLowerCase();

    this.splitMembers.update((customMembers) => {
      const normalizedCustom = customMembers.map((m) => m.toLowerCase());
      const userAlreadyExists = normalizedCustom.includes(normalizedInput);

      if (userAlreadyExists) {
        this.toastService.show({
          variant: 'warning',
          title: 'Member already exists!',
          details: 'This member is already in the pool.',
        });
        return customMembers;
      }
      const updatedMembers = [...customMembers, trimmedName];
      this.onPresentMembersChangeEvent.emit(updatedMembers);
      return updatedMembers;
    });
  }

  protected toggleMemberChecked(memberName: string) {
    const control = this.formModel().eventMembers();
    const members = control.value();
    const isSelected = members.includes(memberName);

    let updatedMembers: string[];

    if (isSelected) updatedMembers = members.filter((member) => member !== memberName);
    else updatedMembers = [...members, memberName];

    this.onPresentMembersChangeEvent.emit(updatedMembers);
  }

  constructor() {
    effect(() => {
      const selectedSquad = this.formModel().squadName().value();
      this.isSquadCustom.set(selectedSquad === 'CUSTOM');

      const squadNameChanged =
        this.previousSquadName !== null && this.previousSquadName !== selectedSquad;

      if (!selectedSquad || selectedSquad === 'CUSTOM') {
        this.splitMembers.set([]);
        if (squadNameChanged) {
          const alreadyEmpty = untracked(
            () => this.formModel().eventMembers().value().length === 0,
          );
          if (!alreadyEmpty) {
            this.onPresentMembersChangeEvent.emit([]);
          }
        }
        this.previousSquadName = selectedSquad;
        return;
      }

      const squad = this.existingSquads().find((s) => s.squadName === selectedSquad);

      if (!squad) {
        this.toastService.show({
          variant: 'error',
          title: "Couldn't find your squad!",
          details: `Unable to find the [${selectedSquad}] squad.`,
        });
        this.previousSquadName = selectedSquad;
        return;
      }

      const memberNames = [...squad.squadMembers];
      this.splitMembers.set(memberNames);

      if (squadNameChanged) {
        this.onPresentMembersChangeEvent.emit(memberNames);
      }

      this.previousSquadName = selectedSquad;
    });
  }
}
