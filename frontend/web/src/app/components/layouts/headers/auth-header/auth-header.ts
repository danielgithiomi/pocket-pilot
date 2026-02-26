import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'auth-header',
  imports: [NgOptimizedImage],
  styleUrl: './auth-header.css',
  templateUrl: './auth-header.html',
})
export class AuthHeader {
  protected readonly logoSize: number = 140;
  protected readonly logoPath = '/images/branding/logo.png';
}
