import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Button } from "@components/ui/atoms/button";
import { NotificationBell, Settings } from '@atoms/icons';
import { DrawerService } from '@infrastructure/services';

@Component({
  selector: 'header-dropdown',
  styleUrl: './header-dropdown.css',
  imports: [NotificationBell, Settings, NgClass, Button],
  template: `
    <div id="header-dropdown" [ngClass]="{ 'hidden!': !drawerService.isDropdownOpen() }">
      <div class="dropdown-arrow"></div>

      <div class="dropdown-notifications">
        <icon-notification-bell />
        <icon-settings />

        <div class="separator"></div>
      </div>

      <div class="dropdown-logout">
        <atom-button id="logout" label="Logout" className="w-fit m-4" (click)="logout()" />
      </div>
    </div>
  `,
})
export class HeaderDropdown {
  protected readonly drawerService: DrawerService = inject(DrawerService);

  protected logout(): void {
    console.log('clicked');
  }
}
