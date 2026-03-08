import { Component } from '@angular/core';
import { ImageDimensions } from '@libs/types';
import { NgOptimizedImage } from '@angular/common';
import { NotificationBell, SettingsIcon } from '@components/ui/atoms/icons';

@Component({
  selector: 'app-header',
  styleUrl: './app-header.css',
  templateUrl: './app-header.html',
  imports: [NotificationBell, SettingsIcon, NgOptimizedImage],
})
export class AppHeader {
  protected readonly logoUrl: string = '/images/branding/logo.png';
  protected readonly logoDimensions: ImageDimensions = { width: 50, height: 50 };
}
