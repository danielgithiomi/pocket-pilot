import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { Select } from '@atoms/select';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { SelectOption } from '@atoms/select';
import { FieldTree } from '@angular/forms/signals';
import { DatePicker } from '@organisms/date-picker';
import { COMMON_CURRENCIES } from '@global/constants';
import { SplitFormSchema } from '../split-form.types';
import { SplitwiseService } from '@api/splitwise.service';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ISquadMember, SquadMember } from '@structural/main/squad-member/squad-member';

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
  readonly formModel = input.required<FieldTree<SplitFormSchema, string | number>>();

  // SERVICES
  private readonly toastService = inject(ToastService);
  private readonly splitwiseService = inject(SplitwiseService);

  // DATA
  protected readonly maxDate = new Date();
  protected readonly currencies = COMMON_CURRENCIES;
  private readonly userSquads = this.splitwiseService.getUserSquads();

  // INTERNAL STATE
  protected readonly selectedSquad = signal<string>('');
  protected readonly splitMembers = signal<string[]>([]);
  protected readonly isSquadCustom = signal<boolean>(false);
  protected readonly isMemberNameValid = signal<boolean>(false);
  private readonly memberCheckedState = signal<CheckedMember>({});

  // COMPUTED
  protected readonly squads = computed(() => this.userSquads.value()?.data || []);
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

  // METHODS
  protected validateMemberName(memberName: string) {
    const trimmedName = memberName.trim();
    const alreadyExists = this.splitMembers()
      .map((member) => member.toLowerCase())
      .includes(trimmedName.toLowerCase());

    const isValid = trimmedName.length > 1 && trimmedName.length <= 20 && !alreadyExists;

    this.isMemberNameValid.set(isValid);
  }

  protected addNewMemberToPool(memberName: string) {
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

  constructor() {
    effect(() => {
      const selectedSquad = this.formModel().squadName().value();
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

    effect(() => {
      // Track all dependencies that affect the final member list
      const isCustom = this.isSquadCustom();
      const selectedSquad = this.selectedSquad();
      const customMembers = this.splitMembers();
      const checkedState = this.memberCheckedState();

      // Get the source members list
      const sourceMembers = isCustom
        ? customMembers
        : this.squads().find((squad) => squad.squadName === selectedSquad)?.squadMembers || [];

      // Compute selected members based on checked state (default to checked if not in state)
      const selectedMembers = sourceMembers.filter((member) => checkedState[member] ?? true);

      this.formModel().eventMembers().controlValue.set(selectedMembers);
    });
  }
}

type CheckedMember = Record<string, boolean>;
