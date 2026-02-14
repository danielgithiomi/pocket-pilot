import {Component} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'auth-header',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './auth-header.html',
  styleUrl: './auth-header.css',
})
export class AuthHeader {

  protected readonly NgOptimizedImage = NgOptimizedImage;
}
