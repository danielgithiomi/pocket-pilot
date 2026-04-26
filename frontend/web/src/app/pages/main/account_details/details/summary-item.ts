import { Component, input } from '@angular/core';

@Component({
  selector: 'summary-item',
  template: `
    <div [id]="id()" class="flex flex-row gap-1 items-center cursor-default! overflow-hidden">
      <span class="text-base text-primary not-italic">•</span>
      <p
        class="text-sm text-muted-text italic cursor-default! overflow-hidden truncate line-clamp-1 text-ellipsis"
      >
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
