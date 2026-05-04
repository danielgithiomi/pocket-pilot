import { NgClass } from '@angular/common';
import { AuthService } from '@api/auth.service';
import { DrawerService } from '@infrastructure/services';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';
import { Component, computed, inject, input } from '@angular/core';
import { HeaderDropdown } from '../header-dropdown/header-dropdown';

@Component({
  selector: 'user-summary',
  imports: [LucideAngularModule, NgClass, HeaderDropdown],
  styles: `
    @reference "tailwindcss";

    .user-summary {
      @apply relative flex flex-row items-center gap-2 min-w-10 max-w-50 hover:bg-(--body-background) transition-all duration-300 cursor-pointer rounded-lg py-1 px-2 z-999;
    }

    .avatar {
      @apply size-8 bg-(--primary) grid place-items-center rounded-full shrink-0 mr-4 sm:mr-0 overflow-hidden;
    }

    .content {
      @apply flex-col space-y-0.5 overflow-hidden mr-4 hidden sm:flex;
    }

    p {
      pointer-events: none !important;
    }
  `,
  template: `
    <div
      id="user-summary"
      class="user-summary"
      (click)="drawerService.toggleDropdown()"
      [ngClass]="{
        'bg-body-background group': drawerService.isDropdownOpen(),
        'hover:bg-transparent! cursor-default!': !drawerService.isDropdownOpen(),
      }"
    >
      <!-- ABS: Dropdown Chevron Start  -->
      @if (withDrawerLayout()) {
        <div
          id="profile-chevron"
          [ngClass]="{ 'rotate-180': drawerService.isDropdownOpen() }"
          class="absolute top-1/2 -translate-y-1/2 right-2 transition-transform duration-300"
        >
          <lucide-angular [size]="12" [img]="ChevronDown" name="profile-chevron" />
        </div>
      }
      <!-- ABS: Dropdown Chevron End -->

      <div id="avatar" class="avatar">
        @if (profilePictureUrl()) {
          <img
            alt="Profile Picture"
            [src]="profilePictureUrl()"
            class="w-full h-full object-cover"
          />
        } @else {
          <p class="text-white">{{ initial() }}</p>
        }
      </div>

      <div class="content">
        <p class="text-sm line-clamp-1 truncate font-medium">{{ username() }}</p>
        <p class="text-xs text-muted-text line-clamp-1 truncate">{{ email() }}</p>
      </div>

      @if (withDrawerLayout()) {
        <header-dropdown />
      }
    </div>
  `,
})
export class UserSummary {
  // Inputs
  readonly withDrawerLayout = input.required<boolean>();

  protected readonly authService: AuthService = inject(AuthService);
  protected readonly drawerService: DrawerService = inject(DrawerService);

  protected readonly ChevronDown = ChevronDown;
  protected readonly user = this.authService.user;

  protected readonly email = computed(() => this.user()?.email ?? '');
  protected readonly username = computed(() => this.user()?.name ?? '');
  protected readonly profilePictureUrl = computed(() => this.user()?.profilePictureUrl ?? null);

  protected readonly initial = computed(() => {
    const name = this.username();
    return name ? name.substring(0, 1).toUpperCase() : '';
  });
}
