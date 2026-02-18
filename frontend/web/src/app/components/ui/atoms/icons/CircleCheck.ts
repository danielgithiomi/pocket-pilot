import {Component, Input} from '@angular/core';

@Component({
  selector: 'icon-circle-check',
  template: `
    <svg
      aria-hidden="true"
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      [attr.stroke]="color"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.stroke-width]="strokeWidth"
      xmlns="http://www.w3.org/2000/svg"
      [attr.fill]="filled && fillColor ? fillColor : 'none'"
      class="lucide lucide-circle-check h-3.5 w-3.5 text-(--color-primary)">
      <circle cx="12" cy="12" [attr.r]="size / 2"></circle>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
  `,
})
export class CircleCheck {
  @Input() size: number = 20;
  @Input() filled: boolean = false;
  @Input() strokeWidth: number = 1.5;
  @Input() fillColor: string = 'red';
  @Input() color: string = 'var(--color-primary)';
}
