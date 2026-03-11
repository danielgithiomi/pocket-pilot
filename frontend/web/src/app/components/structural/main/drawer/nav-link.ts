import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { DrawerNavigationLink } from '@libs/types';
import { Component, computed, inject, input, output } from '@angular/core';
import {
  House,
  UserRoundCog,
  ChevronRight,
  LayoutDashboard,
  LucideAngularModule,
} from 'lucide-angular';

@Component({
  selector: 'nav-link',
  imports: [LucideAngularModule, NgClass],
  styleUrl: './nav-link.css',
  template: `
    <div
      (click)="navigate()"
      class="navigation-link group"
      [ngClass]="{ 'justify-center!': !isDrawerExpanded() }"
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
  private readonly router = inject(Router);
  isDrawerExpanded = input.required<boolean>();
  link = input.required<DrawerNavigationLink>();

  protected readonly chevronRight = ChevronRight;
  protected iconSize = computed(() => (this.isDrawerExpanded() ? 16 : 20));
  protected readonly iconMap: Record<DrawerNavigationLink['icon'], any> = {
    home: House,
    profile: UserRoundCog,
    dashboard: LayoutDashboard,
  };

  protected navigate() {
    this.navLinkClicked.emit();
    this.router.navigate([this.link().path]);
  }
}
