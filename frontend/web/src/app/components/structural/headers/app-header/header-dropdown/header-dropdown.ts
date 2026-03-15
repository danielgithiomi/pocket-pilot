import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { Button } from "@components/ui/atoms/button";
import { NotificationBell, Settings } from '@atoms/icons';

@Component({
  selector: 'header-dropdown',
  styleUrl: './header-dropdown.css',
  imports: [NotificationBell, Settings, NgClass, Button],
  template: `
    <div id="header-dropdown" [ngClass]="{ 'hidden!': !isDropdownOpen() }">
      <div class="dropdown-arrow"></div>

      <div class="dropdown-notifications">
        <icon-notification-bell />
        <icon-settings />

        <div class="separator"></div>
      </div>

      <div class="dropdown-logout">
        <atom-button id="logout" label="Logout" className="w-fit m-4" />
      </div>
    </div>
  `,
})
export class HeaderDropdown {
  isDropdownOpen = input<boolean>(false);
}
