import {Auth_Feature} from "@libs/types";
import {APP_FEATURES} from '@libs/constants';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {AuthFeature} from '@layouts/auth/auth-feature/auth-feature';
import {Component, Input, signal, WritableSignal} from '@angular/core';

@Component({
  selector: 'auth-branding',
  imports: [AuthFeature, NgOptimizedImage, NgClass],
  template: `
    <div id="branding" class="h-full">
      <div id="background"></div>

      <div id="content" [ngClass]="contentAlign == 'right' ? 'items-end' : 'items-start'">
        <img alt="app-logo" height="70" ngSrc="/images/branding/logo.png" width="70"/>

        <div class="flex flex-col gap-8 text-balance" [ngClass]="contentAlign == 'right' ? 'items-end text-end' : 'items-start text-start'">
          <h1>Pocket Pilot</h1>

          <p>
            Take control of your finances with intuitive tracking, instant insights, and
            easy-to-manage accounts.
          </p>

          <ul class="flex flex-col gap-2">
            @for (feature of features; track feature.id) {
              <auth-feature [contentOrder]="contentAlign == 'right' ? 'reversed' : 'normal'" [feature]="feature.name"></auth-feature>
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
  @Input({ required: true }) contentAlign: 'right' | 'left' = 'left';

  protected readonly features: Auth_Feature[] = APP_FEATURES;
  protected year: WritableSignal<number> = signal(new Date().getFullYear());
}
