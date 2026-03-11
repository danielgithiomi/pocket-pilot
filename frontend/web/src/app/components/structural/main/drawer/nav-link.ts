import { Router } from '@angular/router';
import { DrawerNavigationLink } from '@libs/types';
import { Component, inject, input } from '@angular/core';
import { LucideAngularModule, LayoutDashboard, UserRoundCog, House } from 'lucide-angular';

@Component({
  selector: 'nav-link',
  imports: [LucideAngularModule],
  styleUrl: './nav-link.css',
  template: `
    <div class="navigation-link group" (click)="navigate()">
      <div class="icon-wrapper">
        <lucide-angular [size]="iconSize" [name]="link().name" [img]="iconMap[link().icon]" />
      </div>

      <p class="link-text">{{ link().name }}</p>
    </div>
  `,
})
export class NavLink {
  private readonly router = inject(Router);
  link = input.required<DrawerNavigationLink>();

  protected iconSize = 16;
  protected readonly iconMap: Record<DrawerNavigationLink['icon'], any> = {
    home: House,
    profile: UserRoundCog,
    dashboard: LayoutDashboard,
  };

  protected navigate() {
    this.router.navigate([this.link().path]);
  }
}
