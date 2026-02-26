import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage],
  styleUrl: './app-header.css',
  templateUrl: './app-header.html',
})
export class AppHeader {
  protected readonly logoSize: number = 140;
  protected readonly logoPath = '/images/branding/logo.png';
}
