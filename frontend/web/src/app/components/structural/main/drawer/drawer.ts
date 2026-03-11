import { ImageDimensions } from '@libs/types';
import { WEB_ROUTES } from '@global/constants';
import { Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Chevron } from '@components/ui/atoms/icons';

@Component({
  selector: 'app-drawer',
  styleUrl: './drawer.css',
  templateUrl: './drawer.html',
  imports: [NgOptimizedImage, Chevron],
})
export class Drawer {
  protected readonly drawerOpen = signal<boolean>(true);
  protected readonly logoUrl: string = '/images/branding/logo.png';
  protected readonly logoDimensions: ImageDimensions = { width: 70, height: 70 };

  protected readonly links = WEB_ROUTES;

  toggleDrawer() {
    this.drawerOpen.set(!this.drawerOpen());
  }
}
