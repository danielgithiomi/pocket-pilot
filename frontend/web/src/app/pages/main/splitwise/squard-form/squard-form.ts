import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { SplitwiseSquad } from '@global/types';
import { Form, FormCloseEvent } from '@organisms/form';
import { SplitwiseService } from '@api/splitwise.service';
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
    readonly closeCreateFormSquadEvent = output<boolean>();

    // SERVICES
    private readonly toastService = inject(ToastService);
    private readonly splitwiseService = inject(SplitwiseService);

    // STATE SIGNALS
    protected readonly isMemberNameValid = signal<boolean>(false);
    protected readonly selectedSquadMembers = signal<string[]>([]);
    protected readonly isSubmittingCreateSquadForm = signal<boolean>(false);

    // FORM
    protected readonly createSquadFormModel = signal<CreateSquadSchema>(initialCreateSquadData);
    protected readonly createSquadForm = form(
        this.createSquadFormModel,
        createSquadValidationSchema,
    );

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

        const existingMemberNames = new Set(
            this.existingSquadMembers().map((m) => m.toLowerCase()),
        );
        const localMembers = selectedMembers
            .filter((member) => !existingMemberNames.has(member.toLowerCase()))
            .map((member) => ({
                memberName: member,
                isChecked: true,
            }));

        return [...selectedExisitingMembers, ...localMembers].reverse();
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
                        title: 'Member already exists!',
                        details: 'This member already belongs to this squad.',
                    });
                    return selectedMembers;
                }
            }

            return [...selectedMembers, trimmedName];
        });
    }

    protected resetCreateSquadForm() {
        this.selectedSquadMembers.set([]);
        this.isMemberNameValid.set(false);

        this.createSquadForm().reset();
        this.createSquadFormModel.set(initialCreateSquadData);
    }

    protected handleCreateSquadFormClose(event: FormCloseEvent) {
        if (event === 'icon') this.resetCreateSquadForm();
        this.closeCreateFormSquadEvent.emit(false);
    }

    // SUBMISSIONS
    protected handleCreateSquadFormSubmit(event: Event) {
        event.preventDefault();

        // Set the members to the form field
        if (!this.selectedSquadMembers() || this.selectedSquadMembers().length <= 1) {
            this.toastService.show({
                variant: 'warning',
                title: 'Very few members!',
                details: 'A squad must have at least two members.',
            });
            return;
        }

        this.isSubmittingCreateSquadForm.set(true);
        this.createSquadForm.squadMembers().controlValue.set(this.selectedSquadMembers());

        const { ...payload } = this.createSquadFormModel();

        setTimeout(() => {
            this.splitwiseService.createNewUserSquad(payload).subscribe({
                next: (response: SplitwiseSquad) => {
                    this.toastService.show({
                        variant: 'success',
                        title: 'Squad created successfully!',
                        details: `Your [${response.squadName}] squad has been created successfully.`,
                    });

                    this.resetCreateSquadForm();
                    this.closeCreateFormSquadEvent.emit(true);
                },
                complete: () => {
                    this.isSubmittingCreateSquadForm.set(false);
                },
            });
        }, 2000);
    }
}
