import { Component } from '@angular/core';
import { ImageDimensions } from '@libs/types';
import { NgOptimizedImage } from '@angular/common';
import { Chevron } from "@components/ui/atoms/icons";

@Component({
  selector: 'app-drawer',
  styleUrl: './drawer.css',
  templateUrl: './drawer.html',
  imports: [NgOptimizedImage, Chevron],
})
export class Drawer {
  
  protected readonly logoUrl: string = '/images/branding/logo.png';
  protected readonly logoDimensions: ImageDimensions = { width: 70, height: 70 };
}
