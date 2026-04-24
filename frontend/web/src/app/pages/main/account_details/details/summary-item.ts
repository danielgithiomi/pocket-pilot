import { Component, input } from '@angular/core';

@Component({
  selector: 'summary-item',
  template: `
    <div [id]="id()" class="flex flex-row gap-1 items-center">
      <!-- <span class="text-primary not-italic">‣</span> -->
      <span class="text-base text-primary not-italic">•</span>
      <p class="text-sm text-muted-text italic">
        {{ label() }}:
        <span class="not-italic font-semibold text-primary">{{ value() }}</span>
      </p>
    </div>
  `,
})
export class SummaryItem {
  // INPUT
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly value = input.required<string>();
}
