import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-arrowed-circle',
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      [attr.fill]="filled && fillColor ? fillColor : 'none'"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 21C16.9699 21 21 16.9709 21 12C21 7.03005 16.9699 3 12 3C7.03005 3 3 7.03005 3 12C3 16.9709 7.03005 21 12 21Z"
        [attr.stroke]="color"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M11 15L14 12L11 9"
        [attr.stroke]="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class ArrowedCircle {
  @Input() size: number = 20;
  @Input() color: string = 'red';
  @Input() filled: boolean = false;
  @Input() fillColor: string = 'red';
}
