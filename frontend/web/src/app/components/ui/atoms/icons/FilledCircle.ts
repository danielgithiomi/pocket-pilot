import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-filled-circle',
  template: `
    <svg
      class="atom-icon"
      fill="none"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 20 20"
      [attr.stroke-width]="strokeWidth()"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        [attr.fill]="color()"
        d="M8 0a8 8 0 100 16A8 8 0 008 0z"
        [attr.stroke-width]="strokeWidth()"
      />
    </svg>
  `,
})
export class FilledCircle {
  size = input<number>(20);
  strokeWidth = input<number>(2);
  color = input<string>('var(--primary)');
}
