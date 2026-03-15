import { NgClass } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import { DrawerService } from '@infrastructure/services';
import { Drawer } from '@components/structural/main/drawer/drawer';
import { AppHeader } from '@components/structural/headers/app-header/app-header';

@Component({
  selector: 'main-layout',
  styleUrl: './main.layout.css',
  imports: [RouterOutlet, AppHeader, Drawer, NgClass],
  template: `
    <section id="main-layout" class="main-layout relative">
      <!-- Mobile Drawer Start -->
      @if (drawerService.isMobileDrawerOpen()) {
        <div id="mobile-drawer" class="mobile-drawer">
          <div class="overlay" (click)="drawerService.closeMobileDrawer()"></div>
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
        <app-header
          class="header"
          (hamburgerClickEmitter)="drawerService.openMobileDrawer()"
        ></app-header>

        <div id="content" class="flex-1">
          <router-outlet class="flex-1 w-full" />
        </div>
      </section>
    </section>
  `,
})
export class MainLayout {
  drawerService = inject(DrawerService);
}
