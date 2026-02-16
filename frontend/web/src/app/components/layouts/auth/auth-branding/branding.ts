import {Auth_Feature} from "@libs/types";
import {APP_FEATURES} from '@libs/constants';
import {NgOptimizedImage} from '@angular/common';
import {Component, signal, WritableSignal} from '@angular/core';
import {AuthFeature} from '@layouts/auth/auth-feature/auth-feature';

@Component({
  selector: 'auth-branding',
  imports: [AuthFeature, NgOptimizedImage],
  template: `
    <div id="branding" class="h-full">
      <div id="background"></div>

      <div id="content">
        <img alt="app-logo" height="50" ngSrc="/images/branding/logo.png" width="50"/>

        <div class="flex flex-col gap-8 text-balance">
          <h1>Pocket Pilot</h1>

          <p>
            Take control of your finances with intuitive tracking, instant insights, and
            easy-to-manage accounts.
          </p>

          <ul class="flex flex-col gap-2">
            @for (feature of features; track feature.id) {
              <auth-feature [feature]="feature.name"></auth-feature>
            }
          </ul>
        </div>

        <p class="text-muted-text text-sm">Copyright &copy; {{ year() }}. All Rights Reserved.</p>
      </div>
    </div>
  `,
  styleUrl: './branding.css',
})
export class AuthBranding {
  protected readonly features: Auth_Feature[] = APP_FEATURES;
  protected year: WritableSignal<number> = signal(new Date().getFullYear());
}
