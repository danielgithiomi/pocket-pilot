import { formatToReadable } from '@libs/utils';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'squad-member',
  template: `
    <div
      [id]="memberId()"
      class="px-2 py-1 rounded-xl bg-muted-text flex flex-row items-center gap-2"
    >
      <div class="size-5 bg-body-background grid place-items-center rounded-full">
        <p class="text-xs font-semibold">{{ initial() }}</p>
      </div>

      <p class="text-sm">{{ formattedName() }}</p>
    </div>
  `,
})
export class SquadMember {
  // INPUTS
  readonly name = input.required<string>();

  // COMPUTED
  protected readonly memberId = computed<string>(() => `member-${this.name}`);
  protected readonly formattedName = computed<string>(() => formatToReadable(this.name()));
  protected readonly initial = computed<string>(() => this.name().charAt(0).toUpperCase());
}
