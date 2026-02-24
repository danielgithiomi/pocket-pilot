import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-checked-circle',
  template: `
    <svg
      class="atom-icon"
      aria-hidden="true"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      [attr.stroke]="color()"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.stroke-width]="strokeWidth()"
      xmlns="http://www.w3.org/2000/svg"
      class="lucide lucide-circle-check shrink-0"
      [attr.fill]="filled() && fillColor() ? fillColor() : 'none'"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
  `,
})
export class CheckedCircle {

  size = input<number>(20);
  filled = input<boolean>(false);
  strokeWidth = input<number>(2);
  fillColor = input<string>('red');
  color = input<string>('var(--primary)');
}
