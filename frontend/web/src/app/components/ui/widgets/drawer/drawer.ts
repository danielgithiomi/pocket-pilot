import { NavLink } from './nav-link/nav-link';
import { ImageDimensions } from '@libs/types';
import { Chevron } from '@components/ui/atoms/icons';
import { LucideAngularModule, X } from 'lucide-angular';
import { Component, input, output } from '@angular/core';
import { NgOptimizedImage, NgClass } from '@angular/common';
import { DrawerNavigationLinks as links, AdditionalDrawerNavigationLinks as additionalLinks } from '@libs/constants';

@Component({
  selector: 'app-drawer',
  styleUrl: './drawer.css',
  templateUrl: './drawer.html',
  imports: [NgOptimizedImage, Chevron, NavLink, NgClass, LucideAngularModule],
})
export class Drawer {
  linkClicked = output<void>();
  isMobile = input.required<boolean>();
  drawerOpen = input.required<boolean>();
  protected mobileDrawerCloseOutput = output<void>();
  protected desktopDrawerCloseOutput = output<void>();

  protected readonly X = X;
  protected readonly links = links;
  protected readonly additionalLinks = additionalLinks;
  protected readonly logoUrl: string = '/images/branding/logo.png';
  protected readonly logoDimensions: ImageDimensions = { width: 70, height: 70 };
}
