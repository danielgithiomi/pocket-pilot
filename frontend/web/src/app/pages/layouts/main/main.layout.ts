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
      <!-- Mobile Drawer -->
      @if (mobileDrawerOpen()) {
        <div id="mobile-drawer" class="mobile-drawer">
          <div class="overlay" (click)="closeMobileDrawer()"></div>
          <div class="secondary-drawer">
            <app-drawer [isMobile]="true" class="w-full" [drawerOpen]="true" />
          </div>
        </div>
      }

      <app-drawer
        id="drawer"
        class="drawer"
        [isMobile]="false"
        [drawerOpen]="drawerOpen()"
        (toggleOutput)="toggleDrawerState()"
        [ngClass]="{
          expanded: drawerOpen(),
          collapsed: !drawerOpen(),
        }"
      />

      <section class="main">
        <app-header
          [isMobileDrawerOpen]="mobileDrawerOpen()"
          (hamburgerClickEmitter)="toggleMobileDrawer()"
          class="header"
        ></app-header>

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
}
