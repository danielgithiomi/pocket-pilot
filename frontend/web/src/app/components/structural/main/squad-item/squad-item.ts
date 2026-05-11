import { SplitwiseSquad } from '@global/types';
import { SquadMember } from '../squad-member/squad-member';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { ISquadMember } from '../squad-member/squad-member';
import { Component, computed, input, signal } from '@angular/core';
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
  }
}
