import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { WEB_ROUTES } from '@global/constants';
import { AuthService } from '@api/auth.service';
import { Button } from '@components/ui/atoms/button';
import { DrawerService } from '@infrastructure/services';
import { Component, inject, signal } from '@angular/core';
import { Bell, LogOut, LucideAngularModule, Settings2, UserLock } from 'lucide-angular';

@Component({
  selector: 'header-dropdown',
  styleUrl: './header-dropdown.css',
  imports: [NgClass, Button, LucideAngularModule],
  template: `
    <div
      id="header-dropdown"
      (click)="$event.stopPropagation()"
      [ngClass]="{ 'hidden!': !drawerService.isDropdownOpen() }"
    >
      <div class="dropdown-pointer"></div>

      <div class="dropdown-notifications">
        <div class="flex flex-row gap-4 items-center justify-center">
          <lucide-icon
            class="atom-icon"
            [name]="Bell"
            [img]="Bell"
            [size]="iconSize"
            color="var(--body-background)"
          />
          <lucide-icon
            class="atom-icon"
            [name]="Settings"
            [img]="Settings"
            [size]="iconSize"
            (click)="routeToSettings()"
            color="var(--body-background)"
          />
        </div>

        <div class="separator mb-0!"></div>
      </div>

      <div class="dropdown-view-profile">
        <div
          aria-label="View profile"
          (click)="routeToProfile()"
          class="wrapper group/profile text-inverted-text! dark:hover:text-white!"
        >
          <lucide-icon [img]="UserLock" [name]="UserLock" [size]="iconSize" class="profile-icon" />
          <p
            class="group-hover/profile:text-white text-sm h-full grow text-inverted-text duration-300 transition-all"
          >
            <span class="hidden sm:inline">View</span> Profile
          </p>
        </div>
        <div class="separator mt-2! mb-3!"></div>
      </div>

      <div class="dropdown-logout">
        <atom-button
          id="logout"
          (click)="logout()"
          className="w-full mb-2 sm:mb-0"
          [isLoading]="isLogoutLoading()"
        >
          <div class="w-full flex flex-row items-center justify-center gap-3">
            <lucide-icon [img]="LogOut" [name]="LogOut" [size]="iconSize" />
            <p class="text-white">Logout</p>
          </div>
        </atom-button>
      </div>
    </div>
  `,
})
export class HeaderDropdown {
  protected readonly Bell = Bell;
  protected readonly iconSize = 20;
  protected readonly LogOut = LogOut;
  protected readonly UserLock = UserLock;
  protected readonly Settings = Settings2;
  protected readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  protected readonly isLogoutLoading = signal<boolean>(false);
  protected readonly drawerService: DrawerService = inject(DrawerService);

  protected routeToProfile(): void {
    this.router.navigateByUrl(WEB_ROUTES.profile);
    this.drawerService.closeDropDown();
  }

  protected routeToSettings(): void {
    this.router.navigateByUrl(WEB_ROUTES.settings);
    this.drawerService.closeDropDown();
  }

  protected logout(): void {
    this.isLogoutLoading.set(true);

    this.authService
      .logout()
      .pipe(
        tap(() => {
          this.drawerService.closeDropDown();
          this.router.navigateByUrl(WEB_ROUTES.login);
        }),
      )
      .subscribe({
        complete: () => this.isLogoutLoading.set(false),
      });
  }
}
