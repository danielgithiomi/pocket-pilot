import { Pinger } from '@atoms/pinger';
import { NavLink } from './nav-link/nav-link';
import { ImageDimensions } from '@libs/types';
import { Chevron } from '@components/ui/atoms/icons';
import { ThemeService } from '@infrastructure/services';
import { LucideAngularModule, X } from 'lucide-angular';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { AdditionalDrawerNavigationLinks as additionalLinks, DrawerNavigationLinks as links } from '@libs/constants';

@Component({
    selector: 'app-drawer',
    styleUrl: './drawer.css',
    templateUrl: './drawer.html',
    imports: [NgOptimizedImage, Chevron, NavLink, NgClass, LucideAngularModule, Pinger]
})
export class Drawer {
    // ICONS
    protected readonly X = X;

    // INPUTS
    isMobile = input.required<boolean>();
    drawerOpen = input.required<boolean>();

    // OUTPUTS
    linkClicked = output<void>();
    protected mobileDrawerCloseOutput = output<void>();
    protected desktopDrawerCloseOutput = output<void>();

    // DATA
    protected readonly links = links;
    protected readonly logoUrl: string = '/images/branding/logo.png';
    protected readonly additionalLinks = additionalLinks;
    protected readonly logoDimensions: ImageDimensions = { width: 70, height: 70 };

    // SERVICES
    protected readonly themeService = inject(ThemeService);
}
