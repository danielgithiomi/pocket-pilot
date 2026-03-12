import { NgClass } from '@angular/common';
import { SummaryDropdown } from './summary-dropdown';
import { Component, computed, signal } from '@angular/core';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

@Component({
  selector: 'user-summary',
  imports: [LucideAngularModule, NgClass, SummaryDropdown],
  styles: `
    p {
      pointer-events: none !important;
    }
  `,
  template: `
    <div
      id="user-summary"
      (click)="isDropdownOpen.set(!isDropdownOpen())"
      [ngClass]="{ 'group bg-body-background': isDropdownOpen() }"
      class="relative flex flex-row items-center gap-2 min-w-50 hover:bg-body-background transition-all duration-300 cursor-pointer rounded-lg px-2 py-1"
    >
      <!-- ABS: Dropdown Chevron Start  -->
      <div
        id="profile-chevron"
        [ngClass]="{ 'rotate-180': isDropdownOpen() }"
        class="absolute top-1/2 -translate-y-1/2 right-1 transition-transform duration-300"
      >
        <lucide-angular [size]="12" [img]="ChevronDown" name="profile-chevron" />
      </div>
      <!-- ABS: Dropdown Chevron End -->

      <summary-dropdown [isDropdownOpen]="isDropdownOpen()" />

      <div id="avatar" class="size-9 bg-primary grid place-items-center rounded-full">
        <p class="text-white">{{ initial() }}</p>
      </div>

      <div class="flex flex-col space-y-0.5">
        <p class="text-sm font-medium">{{ username }}</p>
        <p class="text-xs text-muted-text uppercase">User</p>
      </div>
    </div>
  `,
})
export class UserSummary {
  protected readonly ChevronDown = ChevronDown;
  protected isDropdownOpen = signal<boolean>(false);
  protected readonly username = Math.random().toString(36).substring(2, 15);
  protected initial = computed(() => this.username.substring(0, 1).toUpperCase());
}
