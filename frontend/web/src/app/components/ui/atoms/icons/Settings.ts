import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-settings',
  template: `
    <svg
      class="atom-icon"
      viewBox="-1 0 44 44"
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.fill]="fillColor()"
      [attr.stroke-width]="strokeWidth()"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M35,22H13A10,10,0,0,1,13,2H35a10,10,0,0,1,0,20ZM35,4H13a8,8,0,0,0,0,16H35A8,8,0,0,0,35,4ZM13,18a6,6,0,1,1,6-6A6,6,0,0,1,13,18ZM13,8a4,4,0,1,0,4,4A4,4,0,0,0,13,8Zm0,18H35a10,10,0,0,1,0,20H13a10,10,0,0,1,0-20Zm0,18H35a8,8,0,0,0,0-16H13a8,8,0,0,0,0,16ZM35,30a6,6,0,1,1-6,6A6,6,0,0,1,35,30Zm0,10a4,4,0,1,0-4-4A4,4,0,0,0,35,40Z"
        transform="translate(-3 -2)"
        fill-rule="evenodd"
      />
    </svg>
  `,
})
export class SettingsIcon {
  size = input<number>(20);
  filled = input<boolean>(true);
  strokeWidth = input<number>(1);
  color = input<string>('var(--color-primary-text)');
  fillColor = input<string>('var(--color-primary-text)');
}
