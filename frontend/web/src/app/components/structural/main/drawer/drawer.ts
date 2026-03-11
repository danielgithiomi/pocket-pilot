import { NavLink } from './nav-link';
import { ImageDimensions } from '@libs/types';
import { NgOptimizedImage, NgClass } from '@angular/common';
import { Chevron } from '@components/ui/atoms/icons';
import { Component, input, output } from '@angular/core';
import { DrawerNavigationLinks as links } from '@libs/constants';

@Component({
  selector: 'app-drawer',
  styleUrl: './drawer.css',
  templateUrl: './drawer.html',
  imports: [NgOptimizedImage, Chevron, NavLink, NgClass],
})
export class Drawer {
  drawerOpen = input.required<boolean>();
  protected toggleOutput = output<void>();

  protected readonly links = links;
  protected readonly logoUrl: string = '/images/branding/logo.png';
  protected readonly logoDimensions: ImageDimensions = { width: 70, height: 70 };
}
