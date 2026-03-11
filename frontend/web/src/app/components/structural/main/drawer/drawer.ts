import { DrawerNavigationLink, ImageDimensions } from '@libs/types';
import { WEB_ROUTES } from '@global/constants';
import { NgOptimizedImage } from '@angular/common';
import { Chevron } from '@components/ui/atoms/icons';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-drawer',
  styleUrl: './drawer.css',
  templateUrl: './drawer.html',
  imports: [NgOptimizedImage, Chevron],
})
export class Drawer {
  drawerOpen = input.required<boolean>();
  protected toggleOutput = output<void>();

  protected readonly links = () => {
    const routes = WEB_ROUTES;
    const links: DrawerNavigationLink[] = [];
    for (const route of Object.keys(routes)) {
      links.push({ icon: route, name: route, path: route });
    }
    return links;
  };
  protected readonly logoUrl: string = '/images/branding/logo.png';
  protected readonly logoDimensions: ImageDimensions = { width: 70, height: 70 };

}
