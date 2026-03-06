import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Drawer } from '@components/structural/main/drawer/drawer';
import { AppHeader } from '@components/structural/headers/app-header/app-header';

@Component({
  selector: 'main-layout',
  styleUrl: './main.layout.css',
  imports: [RouterOutlet, AppHeader, Drawer],
  template: `
    <section id="main-layout" class="main-layout">
      <app-drawer id="drawer" class="drawer bg-secondary" />

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
