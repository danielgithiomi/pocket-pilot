import { ToastService } from '@atoms/toast';
import { SplitwiseService } from '@api/splitwise.service';
import { SquadMember } from '../squad-member/squad-member';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { ISquadMember } from '../squad-member/squad-member';
import { IVoidResourceResponse, SplitwiseSquad } from '@global/types';
import { Component, computed, inject, input, signal } from '@angular/core';
import { LucideAngularModule, EllipsisVertical, Trash2, Pencil } from 'lucide-angular';

@Component({
  selector: 'squad-item',
  styleUrl: './squad-item.css',
  templateUrl: './squad-item.html',
  imports: [NgOptimizedImage, NgClass, LucideAngularModule, SquadMember],
})
export class SquadItem {
  // ICONS
  protected readonly iconSize: number = 18;
  protected readonly edit = Pencil;
  protected readonly delete = Trash2;
  protected readonly options = EllipsisVertical;

  // INPUTS
  readonly squad = input.required<SplitwiseSquad>();

  // SIGNALS
  protected readonly isDropdownOpen = signal<boolean>(false);
  protected readonly isDeletingSquad = signal<boolean>(false);

  // SERVICES
  private readonly toastService = inject(ToastService);
  private readonly splitwiseService = inject(SplitwiseService);

  // COMPUTED
  protected readonly squadId = computed<string>(() => this.squad().id);
  protected readonly squadInitial = computed<string>(() => {
    const { squadName } = this.squad();
    return squadName.charAt(0).toUpperCase();
  });
  protected readonly squadImage = computed<string>(
    () => this.squad().squadImageKey ?? this.squadInitial(),
  );

  protected readonly squadMembers = computed<ISquadMember[]>(() => {
    const members = this.squad().squadMembers;

    return members.map((member: string) => ({
      isChecked: false,
      memberName: member,
    }));
  });

  // METHODS
  handleOnItemEdit() {
    console.log('Edit squad', this.squadId());
  }

  handleOnItemDelete() {
    console.log('Delete squad', this.squadId());

    this.isDeletingSquad.set(true);

    setTimeout(() => {
      this.splitwiseService.deleteExistingUserSquad(this.squadId()).subscribe({
        next: (response: IVoidResourceResponse) => {
          const { message, details } = response;
          this.toastService.show({
            details,
            title: message,
            variant: 'success',
          });

          this.isDropdownOpen.set(false);
          this.splitwiseService.getUserSquads().reload();
        },
        complete: () => this.isDeletingSquad.set(false),
      });
    }, 2500);
  }
}
