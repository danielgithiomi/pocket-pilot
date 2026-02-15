import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-filled-circle',
  template: `
    <svg
      fill="none"
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path [attr.fill]="color" d="M8 0a8 8 0 100 16A8 8 0 008 0z" />
    </svg>
  `,
})
export class FilledCircle {
  @Input() size: number = 18;
  @Input() color: string = '#ffffff';
}
