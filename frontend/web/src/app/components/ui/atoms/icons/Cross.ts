import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-cross',
  template: `
    <svg
      class="atom-icon"
      fill="none"
      version="1.1"
      viewBox="0 0 16 16"
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.stroke]="color()"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.stroke-width]="strokeWidth()"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m11.25 4.75-6.5 6.5m0-6.5 6.5 6.5" />
    </svg>
  `,
})
export class CrossIcon {
  size = input<number>(24);
  strokeWidth = input<number>(2);
  color = input<string>('var(--primary)');
}
