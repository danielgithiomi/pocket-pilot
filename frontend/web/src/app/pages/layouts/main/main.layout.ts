import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from '@components/layouts/headers/app-header/app-header';
import { ToastService } from '@components/ui/atoms/toast';

@Component({
  selector: 'main-layout',
  imports: [RouterOutlet, AppHeader],
  styleUrl: './main.layout.css',
  template: `
    <section id="main-layout" class="main-layout">
      <app-header class="header"></app-header>

      <section class="main-content">
        <div class="hidden md:block w-1/6 bg-secondary"></div>

        <div class="flex-1">
          <router-outlet class="flex-1 w-full" />
        </div>
      </section>
    </section>
  `,
})
export class MainLayout {}
