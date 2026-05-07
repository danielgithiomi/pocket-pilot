import { NgClass } from '@angular/common';
import { formatToReadable } from '@libs/utils';
import { ISquadMember } from './squad-member.types';
import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, Check } from 'lucide-angular';

@Component({
  selector: 'squad-member',
  imports: [LucideAngularModule, NgClass],
  template: `
    <div
      [id]="memberId()"
      [ngClass]="{
        'cursor-pointer': isCheckable(),
        'bg-loader-primary! border border-primary': isActive(),
      }"
      class="px-2 py-1 rounded-xl bg-muted-text flex flex-row items-center gap-2"
    >
      <div class="size-5 bg-body-background grid place-items-center rounded-full">
        <p class="text-xs font-semibold">{{ initial() }}</p>
      </div>

      <p class="text-sm">{{ formattedName() }}</p>

      @if (isCheckable()) {
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
  readonly isCheckable = input<boolean>(true);
  readonly member = input.required<ISquadMember>();

  // COMPUTED
  protected readonly isChecked = computed<boolean>(() => this.member().isChecked);
  protected readonly memberId = computed<string>(() => `member-${this.member().memberName}`);
  protected readonly isActive = computed<boolean>(() => this.isCheckable() && this.isChecked());
  protected readonly formattedName = computed<string>(() => formatToReadable(this.member().memberName));
  protected readonly initial = computed<string>(() => this.member().memberName.charAt(0).toUpperCase());
}
