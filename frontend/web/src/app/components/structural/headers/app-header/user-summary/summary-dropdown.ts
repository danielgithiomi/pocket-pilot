import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  imports: [NgClass],
  selector: 'summary-dropdown',
  template: ` <div
    id="profile-dropdown"
    [ngClass]="{ hidden: !isDropdownOpen() }"
    class="w-full h-20 bg-inverted-background absolute top-full right-0 mt-3 z-10 rounded-lg shadow-xl"
  >
    <div class="size-3 bg-inverted-background rotate-45 -top-1 right-1.5 absolute"></div>
  </div>`,
})
export class SummaryDropdown {
  isDropdownOpen = input<boolean>(false);
}
