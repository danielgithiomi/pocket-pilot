import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { WEB_ROUTES } from '@global/constants';
import { AuthService } from '@api/auth.service';
import { Component, inject } from '@angular/core';
import { Button } from '@components/ui/atoms/button';
import { DrawerService } from '@infrastructure/services';
import { LucideAngularModule, Bell, Settings2 } from 'lucide-angular';

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
            color="var(--body-background)"
          />
        </div>

        <div class="separator"></div>
      </div>

      <div class="dropdown-logout">
        <atom-button id="logout" label="Logout" className="w-full" (click)="logout()" />
      </div>
    </div>
  `,
})
export class HeaderDropdown {
  protected readonly Bell = Bell;
  protected readonly iconSize = 20;
  protected readonly Settings = Settings2;
  protected readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  protected readonly drawerService: DrawerService = inject(DrawerService);

  protected logout(): void {
    this.authService
      .logout()
      .pipe(
        tap(() => {
          this.drawerService.closeDropDown();
          this.router.navigateByUrl(WEB_ROUTES.login);
        })
      )
      .subscribe();
  }
}
