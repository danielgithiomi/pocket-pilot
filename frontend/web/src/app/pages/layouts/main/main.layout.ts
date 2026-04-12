import { NgClass } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Drawer } from '@widgets/drawer/drawer';
import { Component, inject } from '@angular/core';
import { DrawerService } from '@infrastructure/services';
import { AppHeader } from '@structural/headers/app-header/app-header';

@Component({
  selector: 'main-layout',
  styleUrl: './main.layout.css',
  imports: [Drawer, AppHeader, RouterOutlet, NgClass],
  template: `
    <section id="main-layout" class="main-layout">
      <!-- Mobile Drawer Start -->
      @if (drawerService.isMobileDrawerOpen()) {
        <div id="mobile-drawer" class="mobile-drawer">
          <div class="mobile-drawer-overlay" (click)="drawerService.closeMobileDrawer()"></div>
          <div class="secondary-drawer">
            <app-drawer
              class="w-full"
              [isMobile]="true"
              [drawerOpen]="true"
              (linkClicked)="drawerService.closeMobileDrawer()"
              (mobileDrawerCloseOutput)="drawerService.closeMobileDrawer()"
            />
          </div>
        </div>
      }
      <!-- Mobile Drawer End -->

      @if (drawerService.isDropdownOpen()) {
        <div class="dropdown-overlay" (click)="drawerService.closeDropDown()"></div>
      }

      <app-drawer
        id="drawer"
        class="drawer"
        [isMobile]="false"
        [drawerOpen]="!drawerService.isDrawerCollapsed()"
        [ngClass]="{
          expanded: !drawerService.isDrawerCollapsed(),
          collapsed: drawerService.isDrawerCollapsed(),
        }"
        (desktopDrawerCloseOutput)="drawerService.toggleDesktopDrawer()"
      />

      <section class="main">
        <app-header class="header" (hamburgerClickEmitter)="drawerService.openMobileDrawer()" />

        <div id="content" class="flex-1">
          <router-outlet class="flex-1 w-full" />
        </div>
      </section>
    </section>
  `,
})
export class MainLayout {
  protected readonly drawerService = inject(DrawerService);
}
