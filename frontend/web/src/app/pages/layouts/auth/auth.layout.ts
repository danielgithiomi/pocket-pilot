import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'auth-layout',
  imports: [RouterOutlet],
  template: `
  <section id="auth">
    <router-outlet />
  </section>`,
})
export class AuthLayout {}
