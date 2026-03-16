import { NgClass } from '@angular/common';
import { MainContent } from './main.content';
import { AuthService } from '@api/auth.service';
import { Component, computed, inject } from '@angular/core';

@Component({
  selector: 'main-layout',
  styleUrl: './main.layout.css',
  imports: [MainContent, NgClass],
  template: `
    <section id="application-wrapper" [ngClass]="{ 'grid! place-items-center!': isLoading() }">
      @if (isLoading()) {
        <div class="loader-container">
          <div class="loader"></div>
          <p>Loading. Please wait...</p>
        </div>
      } @else {
        <main-content />
      }
    </section>
  `,
})
export class MainLayout {
  protected readonly authService: AuthService = inject(AuthService);
  protected isLoading = computed<boolean>(() => this.authService.isLoading());
}
