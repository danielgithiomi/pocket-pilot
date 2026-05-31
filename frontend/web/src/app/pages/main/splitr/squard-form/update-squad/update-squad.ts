import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { SplitrSquad } from '@global/types';
import { form } from '@angular/forms/signals';
import { formatToReadable } from '@libs/utils';
import { SplitrService } from '@api/splitr.service';
import { Form, FormCloseEvent } from '@organisms/form';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import { squadValidationSchema, squadSchema } from '../squad-form.types';
import { ISquadMember, SquadMember } from '@structural/main/squad-member/squad-member';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';

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
    readonly squad = input.required<SplitrSquad>();
    readonly allSquadMembers = input.required<string[]>();

    // OUTPUTS
    readonly closeUpdateSquadFormEvent = output<boolean>();

    // SERVICES
    private readonly toastService = inject(ToastService);
    private readonly splitrService = inject(SplitrService);

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
    protected readonly updateSquadFormModel = signal<squadSchema>(this.initialUpdateSquadData);
    protected readonly updateSquadForm = form<squadSchema>(
        this.updateSquadFormModel,
        squadValidationSchema,
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
            this.updateSquadForm
                .squadMembers()
                .controlValue.set([normalizedInput, ...squadMembers]);
            return;
        }

        const isExistingMember = squadMembers.includes(memberName);

        let updatedList: string[] = [];
        if (isExistingMember) updatedList = squadMembers.filter((member) => member !== memberName);
        else updatedList = [...squadMembers, memberName];

        this.updateSquadForm.squadMembers().controlValue.set(updatedList.map(formatToReadable));
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

    // SUBMISSION
    protected handleUpdateSquadFormSubmit(event: Event) {
        event.preventDefault();

        this.isSubmittingUpdateSquadForm.set(true);

        const { ...payload } = this.updateSquadFormModel();

        setTimeout(() => {
            this.splitrService.updateExistingUserSquad(this.squad().id, payload).subscribe({
                next: (response: SplitrSquad) => {
                    this.toastService.show({
                        variant: 'success',
                        title: 'Squad updated successfully!',
                        details: `Your [${response.squadName}] squad has been updated successfully.`,
                    });

                    this.resetUpdateSquadForm();
                    this.closeUpdateSquadFormEvent.emit(true);
                },
                complete: () => this.isSubmittingUpdateSquadForm.set(false),
            });
        }, 1000);
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
