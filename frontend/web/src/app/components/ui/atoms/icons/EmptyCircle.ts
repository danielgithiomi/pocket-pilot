import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-empty-circle',
  template: `
    <svg
      fill="none"
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" [attr.stroke]="color" stroke-width="2" />
    </svg>
  `,
})
export class EmptyCircle {
  @Input() size: number = 18;
  @Input() color: string = 'var(--color-primary)';
}
