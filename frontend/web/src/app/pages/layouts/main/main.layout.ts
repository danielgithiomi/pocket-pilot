import { NgClass } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, signal } from '@angular/core';
import { Drawer } from '@components/structural/main/drawer/drawer';
import { AppHeader } from '@components/structural/headers/app-header/app-header';

@Component({
  selector: 'main-layout',
  styleUrl: './main.layout.css',
  imports: [RouterOutlet, AppHeader, Drawer, NgClass],
  template: `
    <section id="main-layout" class="main-layout relative">
      <!-- Mobile Drawer Start -->
      @if (mobileDrawerOpen()) {
        <div id="mobile-drawer" class="mobile-drawer">
          <div class="overlay" (click)="closeMobileDrawer()"></div>
          <div class="secondary-drawer">
            <app-drawer
              class="w-full"
              [isMobile]="true"
              [drawerOpen]="true"
              (linkClicked)="closeAllDrawers()"
              (mobileDrawerCloseOutput)="closeMobileDrawer()"
            />
          </div>
        </div>
      }
      <!-- Mobile Drawer End -->

      <app-drawer
        id="drawer"
        class="drawer"
        [isMobile]="false"
        [drawerOpen]="drawerOpen()"
        [ngClass]="{
          expanded: drawerOpen(),
          collapsed: !drawerOpen(),
        }"
        (linkClicked)="closeAllDrawers()"
        (desktopDrawerCloseOutput)="toggleDrawerState()"
      />

      <section class="main">
        <app-header class="header" (hamburgerClickEmitter)="toggleMobileDrawer()"></app-header>

        <div id="content" class="flex-1">
          <router-outlet class="flex-1 w-full" />
        </div>
      </section>
    </section>
  `,
})
export class MainLayout {
  protected readonly drawerOpen = signal<boolean>(true);
  protected readonly mobileDrawerOpen = signal<boolean>(false);

  toggleDrawerState() {
    this.drawerOpen.set(!this.drawerOpen());
  }

  toggleMobileDrawer() {
    this.mobileDrawerOpen.set(!this.mobileDrawerOpen());
  }

  closeMobileDrawer() {
    this.mobileDrawerOpen.set(false);
  }

  closeAllDrawers() {
    this.drawerOpen.set(false);
    this.mobileDrawerOpen.set(false);
  }
}
