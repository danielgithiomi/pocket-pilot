import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from '@components/layouts/headers/app-header/app-header';

@Component({
  selector: 'main-layout',
  styleUrl: './main.layout.css',
  imports: [RouterOutlet, AppHeader],
  template: `
    <section id="main-layout" class="main-layout">
      <aside id="aside" class="bg-secondary"></aside>

      <section class="main">
        <app-header class="header"></app-header>

        <div id="content" class="flex-1">
          <router-outlet class="flex-1 w-full" />
        </div>
      </section>
    </section>
  `,
})
export class MainLayout {}
