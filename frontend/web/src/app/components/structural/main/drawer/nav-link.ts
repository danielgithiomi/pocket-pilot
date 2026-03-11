import { RouterLink } from '@angular/router';
import { Component, input } from '@angular/core';
import { DrawerNavigationLink } from '@libs/types';

@Component({
  selector: 'nav-link',
  imports: [RouterLink],
  styleUrl: './nav-link.css',
  template: `
    <div class="navigation-link">
      <a [routerLink]="link().path">{{ link().name }}</a>
    </div>
  `,
})
export class NavLink {
  link = input.required<DrawerNavigationLink>();
}
