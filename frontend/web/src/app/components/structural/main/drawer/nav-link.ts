import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { DrawerNavigationLink } from '@libs/types';
import { Component, computed, inject, input, output } from '@angular/core';
import {
  House,
  Wallet,
  UserRoundCog,
  ChevronRight,
  LayoutDashboard,
  LucideAngularModule,
} from 'lucide-angular';

@Component({
  selector: 'nav-link',
  styleUrl: './nav-link.css',
  imports: [LucideAngularModule, NgClass],
  template: `
    <div
      (click)="navigate()"
      class="navigation-link group"
      [ngClass]="{
        active: router.url === link().path,
        'justify-center!': !isDrawerExpanded(),
      }"
    >
      @if (isDrawerExpanded()) {
        <div class="navigation-content">
          <div class="icon-wrapper">
            <lucide-angular [size]="iconSize()" [name]="link().name" [img]="iconMap[link().icon]" />
          </div>
          <p class="link-text">{{ link().name }}</p>
        </div>
        <div class="navigation-arrow">
          <lucide-angular name="chevron-right" [size]="12" [img]="chevronRight" color="white" />
        </div>
      } @else {
        <div class="navigation-content">
          <div class="icon-wrapper">
            <lucide-angular [size]="iconSize()" [name]="link().name" [img]="iconMap[link().icon]" />
          </div>
        </div>
      }
    </div>
  `,
})
export class NavLink {
  navLinkClicked = output<void>();
  protected readonly router = inject(Router);
  isDrawerExpanded = input.required<boolean>();
  link = input.required<DrawerNavigationLink>();

  protected readonly chevronRight = ChevronRight;
  protected iconSize = computed(() => (this.isDrawerExpanded() ? 16 : 20));
  protected readonly iconMap: Record<DrawerNavigationLink['icon'], any> = {
    home: House,
    accounts: Wallet,
    profile: UserRoundCog,
    dashboard: LayoutDashboard,
  };

  protected navigate() {
    this.navLinkClicked.emit();
    this.router.navigate([this.link().path]);
  }
}
