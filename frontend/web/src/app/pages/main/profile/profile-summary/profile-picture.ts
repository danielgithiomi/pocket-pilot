import { AuthService } from '@api/auth.service';
import { LucideAngularModule, Camera } from 'lucide-angular';
import { Component, computed, inject, input, signal } from '@angular/core';

@Component({
  selector: 'profile-picture',
  imports: [LucideAngularModule],
  styles: `
    @reference 'tailwindcss';

    .profile-picture {
      @apply relative size-20 sm:size-25 bg-(--inverted-background) cursor-pointer rounded-full overflow-hidden hover:scale-101 transition-all duration-300;
    }

    .overlay {
      @apply absolute inset-0 rounded-full grid place-items-center;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      background: var(--overlay-background);
    }
  `,
  template: `
    <!-- Rounded Profile Picture -->
    <div
      id="profile-picture"
      class="profile-picture group"
      (mouseenter)="isHovered.set(true)"
      (mouseleave)="isHovered.set(false)"
    >
      @if (isHovered()) {
        <div class="overlay animate-fade-in">
          <div class="flex flex-col items-center gap-1">
            <lucide-angular
              [size]="20"
              color="white"
              [img]="camera"
              name="change-profile-picture"
            />
            <p class="text-xs text-white">Update</p>
          </div>
        </div>
      }

      @if (profilePictureUrl()) {
        <img [src]="profilePictureUrl()" alt="Profile Picture" class="w-full h-full object-cover" />
      } @else {
        <div class="flex items-center justify-center h-full">
          <p class="text-primary text-5xl">{{ initial() }}</p>
        </div>
      }
    </div>
  `,
})
export class ProfilePicture {
  // ICONS
  protected readonly camera = Camera;

  // STATES
  protected readonly isHovered = signal(false);

  // INPUTS
  profilePictureUrl = input<string | null>(null);

  // SERVICES
  protected readonly authService = inject(AuthService);

  // METHODS
  protected readonly initial = computed(() => {
    const name = this.authService.user()?.name;
    return name ? name.substring(0, 1).toUpperCase() : '';
  });
}
