import { NgClass } from '@angular/common';
import { formatToReadable } from '@libs/utils';
import { LucideAngularModule, Check } from 'lucide-angular';
import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'squad-member',
  imports: [LucideAngularModule, NgClass],
  template: `
    <div
      [id]="memberId()"
      (click)="onMemberEventClick.emit(member().memberName)"
      [ngClass]="{
        'cursor-pointer!': isCheckable(),
        'bg-primary!': inverted() && isActive(),
        'bg-loader-primary! border border-primary': isActive(),
      }"
      class="px-2 py-1 rounded-xl bg-muted-text flex flex-row items-center gap-2"
    >
      <div class="size-5 bg-body-background grid place-items-center rounded-full">
        <p class="text-xs font-semibold">{{ initial() }}</p>
      </div>

      <p class="text-sm">{{ formattedName() }}</p>

      @if (isActive()) {
        <lucide-icon name="member-cheched-icon" [img]="UserCheck" [size]="iconSize" />
      }
    </div>
  `,
})
export class SquadMember {
  // ICONS
  protected readonly iconSize = 12;
  protected readonly UserCheck = Check;

  // INPUTS
  readonly inverted = input<boolean>(false);
  readonly isCheckable = input<boolean>(true);
  readonly member = input.required<ISquadMember>();

  // OUTPUTS
  readonly onMemberEventClick = output<string>();

  // COMPUTED
  protected readonly isChecked = computed<boolean>(() => this.member().isChecked);
  protected readonly memberId = computed<string>(() => `member-${this.member().memberName}`);
  protected readonly isActive = computed<boolean>(() => this.isCheckable() && this.isChecked());
  protected readonly formattedName = computed<string>(() =>
    formatToReadable(this.member().memberName),
  );
  protected readonly initial = computed<string>(() =>
    this.member().memberName.charAt(0).toUpperCase(),
  );
}

export interface ISquadMember {
  memberName: string;
  isChecked: boolean;
}
