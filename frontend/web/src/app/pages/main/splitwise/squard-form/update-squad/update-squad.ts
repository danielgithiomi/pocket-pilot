import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { form } from '@angular/forms/signals';
import { SplitwiseSquad } from '@global/types';
import { formatToReadable } from '@libs/utils';
import { Form, FormCloseEvent } from '@organisms/form';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { createSquadValidationSchema, UpdateSquadSchema } from '../squad-form.types';
import { ISquadMember, SquadMember } from '@structural/main/squad-member/squad-member';

@Component({
    selector: 'update-squad-form',
    templateUrl: './update-squad.html',
    imports: [LucideAngularModule, NgClass, Form, Button, Input, SquadMember],
})
export class UpdateSplitwiseSquad {
    // ICONS
    protected readonly iconSize = 18;
    protected readonly AddUserIcon = UserPlus;

    // INPUTS
    readonly squad = input.required<SplitwiseSquad>();
    readonly allSquadMembers = input.required<string[]>();

    // OUTPUTS
    readonly closeUpdateSquadFormEvent = output<boolean>();

    // STATE SIGNALS
    protected readonly customMembers = signal<string[]>([]);
    protected readonly isMemberNameValid = signal<boolean>(false);
    protected readonly isSubmittingUpdateSquadForm = signal<boolean>(false);

    // FORM
    protected readonly initialUpdateSquadData = {
        squadName: '',
        squadMembers: [],
        squadImageKey: '',
    };
    protected readonly updateSquadFormModel = signal<UpdateSquadSchema>(
        this.initialUpdateSquadData,
    );
    protected readonly updateSquadForm = form<UpdateSquadSchema>(
        this.updateSquadFormModel,
        createSquadValidationSchema,
    );

    // COMPUTED
    protected readonly squadMembersPool = computed<ISquadMember[]>(() => {

        const squadMembers = this.updateSquadForm.squadMembers().value();

        const inputMembers = this.allSquadMembers().map((member) => ({
            memberName: member,
            isChecked: squadMembers.includes(member),
        }));

        const customMembers = this.customMembers().map((member) => ({
            memberName: member,
            isChecked: squadMembers.includes(member),
        }));

        return [...customMembers, ...inputMembers];
    });

    // METHODS
    protected validateMemberName(memberName: string) {
        const allMemberNames = this.squadMembersPool()
            .flatMap((member) => member.memberName)
            .map((name) => name.toLowerCase());

        const normalizedName = memberName.trim().toLowerCase();
        const isValid =
            normalizedName.length > 1 &&
            normalizedName.length <= 20 &&
            !allMemberNames.includes(normalizedName);

        this.isMemberNameValid.set(isValid);
    }

    protected addNewMemberToPool(memberName: string, custom: boolean = true) {

        const squadMembers = this.updateSquadForm.squadMembers().value();

        if (custom) {
            const normalizedInput = memberName.trim();
            this.customMembers.update((members) => [normalizedInput, ...members]);
            this.updateSquadForm.squadMembers().controlValue.set([normalizedInput, ...squadMembers]);
            return;
        }
 
        const isExistingMember = squadMembers.includes(memberName);

        let updatedList: string[] = [];
        if (isExistingMember) updatedList = squadMembers.filter((member) => member !== memberName);
        else updatedList = [...squadMembers, memberName];

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

    protected resetUpdateSquadForm() {
        const { squadName, squadMembers, squadImageKey } = this.squad();

        this.updateSquadForm().reset();
        this.isMemberNameValid.set(false);
        this.updateSquadFormModel.set({
            squadName,
            squadMembers,
            squadImageKey,
        });
    }

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
