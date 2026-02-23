import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-empty-circle',
  template: `
    <svg
      class="atom-icon"
      fill="none"
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" [attr.stroke]="color" [attr.stroke-width]="strokeWidth" />
    </svg>
  `,
})
export class EmptyCircle {
  @Input() size: number = 18;
  @Input() strokeWidth: number = 1;
  @Input() color: string = 'var(--color-primary)';
}
