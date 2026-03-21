import { Button } from '@atoms/button';
import { AuthService } from '@api/auth.service';
import { Component, inject } from '@angular/core';
import { ProfilePicture } from './profile-picture';

@Component({
  selector: 'profile-summary',
  imports: [ProfilePicture, Button],
  styles: `
    @reference 'tailwindcss';

    :host {
      @apply px-2 w-full h-full flex flex-row items-center gap-6;
    }
  `,
  template: `
    <profile-picture />

    <!-- User Info -->
    <div class="flex flex-col justify-between gap-2 h-30 grow">
      <div>
        <p class="text-primary text-lg font-semibold">{{ authService.user()?.name }}</p>
        <p class="text-xs text-muted-text font-semibold">{{ authService.user()?.email }}</p>
      </div>

      <div class="flex flex-row items-center gap-4">
        <atom-button id="go-to-edit-profile" label="Edit" />
        <atom-button id="go-to-notifications" label="Notifications" />
      </div>
    </div>
  `,
})
export class ProfileSummary {
  // SERVICES
  protected readonly authService = inject(AuthService);
}
