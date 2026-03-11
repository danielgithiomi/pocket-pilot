import { RouterLink } from "@angular/router";
import { Component, input } from "@angular/core";
import { DrawerNavigationLink } from "@libs/types";

@Component({
  selector: 'nav-link',
  imports: [RouterLink],
  template: '<a [routerLink]="link().path">{{ link().name }}</a>',
})
export class NavLink {
  link = input.required<DrawerNavigationLink>();
}