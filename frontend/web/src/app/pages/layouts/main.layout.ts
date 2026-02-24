import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'main-layout',
  imports: [RouterOutlet],
  template: `
    <section id="home" class="h-screen flex flex-row">
      <div class="flex-1 bg-red-600"></div>

      <div class="flex-1">
        <router-outlet></router-outlet>
      </div>
    </section>
  `,
  styles: ``,
})
export class MainLayout {}