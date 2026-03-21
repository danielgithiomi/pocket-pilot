import { Button } from '@atoms/button';
import { AuthService } from '@api/auth.service';
import { ProfilePicture } from './profile-picture';
import { Component, inject, output } from '@angular/core';

@Component({
  selector: 'profile-summary',
  imports: [ProfilePicture, Button],
  styles: `
    @reference 'tailwindcss';

    :host {
      @apply px-2 w-full h-full flex flex-row items-center gap-6;
    }
  `,
  templateUrl: './profile-summary.html',
})
export class ProfileSummary {

  // OUTPUTS
  editProfileClicked = output<void>();

  // SERVICES
  protected readonly authService = inject(AuthService);
}
