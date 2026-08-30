import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { Select, SelectOption } from '@atoms/select';
import { NgClass } from '@angular/common';
import { SplitrSquad } from '@shared/types';
import { ToastService } from '@atoms/toast';
import { FieldTree } from '@angular/forms/signals';
import { DatePicker } from '@organisms/date-picker';
import { COMMON_CURRENCIES } from '@shared/constants';
import { SplitFormSchema } from '../split-form.types';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import { ISquadMember, SquadMember } from '@structural/main/squad-member/squad-member';
import { Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';

@Component({
    selector: 'split-form-step-1',
    templateUrl: './split-form-step-1.html',
    imports: [LucideAngularModule, NgClass, Button, Select, Input, DatePicker, SquadMember]
})
export class SplitFormStep1 {
    // ICONS
    protected readonly AddUserIcon = UserPlus;

    // INPUTS
    readonly iconSize = input.required<number>();
    readonly memberPool = input.required<string[]>();
    readonly presentMembers = input.required<string[]>();
    readonly isSubmittingForm = input.required<boolean>();
    readonly existingSquads = input.required<SplitrSquad[]>();
    readonly formModel = input.required<FieldTree<SplitFormSchema, string | number>>();

    // OUTPUTS
    readonly onPresentMembersChangeEvent = output<string[]>();

    // SERVICES
    private readonly toastService = inject(ToastService);

    // DATA
    protected readonly maxDate = new Date();
    protected readonly currencies = COMMON_CURRENCIES;

    // INTERNAL STATE
    protected readonly isSquadCustom = signal<boolean>(false);
    protected readonly isMemberNameValid = signal<boolean>(false);

    // COMPUTED
    protected readonly squadDropdownOptions = computed<SelectOption[]>(() => {
        const squadNames = this.existingSquads().map((squad) => squad.squadName);
        return [...squadNames, 'CUSTOM'].map((squadName) => ({
            value: squadName,
            label: squadName === 'CUSTOM' ? 'Custom' : squadName
        }));
    });
    protected readonly formattedSplitMembers = computed<ISquadMember[]>(() => {
        return this.memberPool().map((member) => ({
            memberName: member,
            isChecked: this.presentMembers().includes(member)
        }));
    });

    // METHODS
    protected validateMemberName(memberName: string) {
        const trimmedName = memberName.trim();
        const alreadyExists = this.presentMembers()
            .map((member) => member.toLowerCase())
            .includes(trimmedName.toLowerCase());

        const isNameValid = trimmedName.length > 1 && trimmedName.length <= 20 && !alreadyExists;

        this.isMemberNameValid.set(isNameValid);
    }

    protected addCustomMemberToPool(memberName: string) {
        const trimmedName = memberName.trim();
        const normalizedInput = trimmedName.toLowerCase();
        const normalizedMemberNames = this.presentMembers().map((m) => m.toLowerCase());

        const userAlreadyExists = normalizedMemberNames.includes(normalizedInput);

        if (userAlreadyExists) {
            this.toastService.show({
                variant: 'warning',
                title: 'Member already exists!',
                details: 'This member is already in the pool.'
            });
            return;
        }

        const updatedMembers = [...this.presentMembers(), trimmedName];
        this.onPresentMembersChangeEvent.emit(updatedMembers);

        // Mark the 'Add' button as invalid again
        this.isMemberNameValid.set(false);
    }

    protected toggleMemberChecked(memberName: string) {
        const isSelected = this.presentMembers().includes(memberName);

        let updatedMembers: string[];

        if (isSelected) updatedMembers = this.presentMembers().filter((member) => member !== memberName);
        else updatedMembers = [...this.presentMembers(), memberName];

        this.onPresentMembersChangeEvent.emit(updatedMembers);
    }

    constructor() {
        effect(() => {
            const squadName = this.formModel().squadName().value();
            untracked(() => this.isSquadCustom.set(squadName === 'CUSTOM'));
        });
    }
}
