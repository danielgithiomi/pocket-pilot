import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { form } from '@angular/forms/signals';
import { SplitwiseSquad } from '@global/types';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import { Form, FormCloseEvent } from '@organisms/form';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { ISquadMember, SquadMember } from '@structural/main/squad-member/squad-member';
import { createSquadValidationSchema, UpdateSquadSchema } from '../squad-form.types';
import { formatToReadable } from '@libs/utils';

@Component({
    selector: 'update-squad-form',
    templateUrl: './update-squad.html',
    imports: [LucideAngularModule, NgClass, Form, Button, Input, SquadMember],
})
export class UpdateSquad {
    // ICONS
    protected readonly iconSize = 18;
    protected readonly AddUserIcon = UserPlus;

    // INPUTS
    readonly squad = input.required<SplitwiseSquad>();
    readonly allSquadMembers = input.required<string[]>();

    // OUTPUTS
    readonly closeUpdateSquadFormEvent = output<boolean>();

    // STATE SIGNALS
    protected readonly isMemberNameValid = signal<boolean>(false);
    protected readonly isSubmittingUpdateSquadForm = signal<boolean>(false);

    // FORM
    protected readonly updateSquadFormModel = signal<UpdateSquadSchema>({
        squadName: '',
        squadMembers: [],
        squadImageKey: '',
    });
    protected readonly updateSquadForm = form<UpdateSquadSchema>(
        this.updateSquadFormModel,
        createSquadValidationSchema,
    );

    // COMPUTED
    protected readonly squadMembersPool = computed<ISquadMember[]>(() => {
        return this.allSquadMembers().map((member) => ({
            memberName: member,
            isChecked: this.updateSquadFormModel().squadMembers.includes(member),
        }));
    });

    // METHODS
    protected validateMemberName(memberName: string) {
        const allMemberNames = this.squadMembersPool()
            .flatMap((member) => member.memberName)
            .map((name) => name.toLowerCase());

        const trimmedName = memberName.trim();
        const isValid =
            trimmedName.length > 1 &&
            trimmedName.length <= 20 &&
            !allMemberNames.includes(trimmedName.toLowerCase());

        this.isMemberNameValid.set(isValid);
    }

    protected addNewMemberToPool(memberName: string) {
        const trimmedName = memberName.trim();
        const normalizedInput = trimmedName.toLowerCase();

        const squadMembers = this.updateSquadForm
            .squadMembers()
            .value()
            .map((m) => m.toLowerCase());

        const isExistingMember = squadMembers.includes(normalizedInput);

        let updatedList: string[] = [];
        if (isExistingMember) updatedList = squadMembers.filter((member) => member !== normalizedInput);
        else updatedList = [...squadMembers, normalizedInput];

        this.updateSquadForm.squadMembers().controlValue.set(updatedList.map(formatToReadable));
    }

    protected handleUpdateSquadFormSubmit(event: Event) {
        event.preventDefault();

        const { ...payload } = this.updateSquadFormModel();
    }

    protected handleUpdateSquadFormClose(event: FormCloseEvent) {
        if (event === 'icon') this.resetUpdateSquadForm();
        this.closeUpdateSquadFormEvent.emit(false);
    }

    protected resetUpdateSquadForm() {}

    constructor() {
        effect(() => {
            const { squadName, squadMembers, squadImageKey } = this.squad();
            this.updateSquadFormModel.set({
                squadName,
                squadMembers,
                squadImageKey,
            });
        });
    }
}
