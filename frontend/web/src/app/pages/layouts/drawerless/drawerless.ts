import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from '@structural/headers/app-header/app-header';

@Component({
  selector: 'drawerless-layout',
  styleUrl: './drawerless.css',
  imports: [RouterOutlet, AppHeader],
  template: `
    <section id="drawerless-layout">
      <app-header [withDrawerLayout]="false" id="drawerless-header" />

      <div id="drawerless-content" class="drawerless-content">
        <router-outlet class="w-full flex-1" />
      </div>
    </section>
  `,
})
export class DrawerlessLayout {}
