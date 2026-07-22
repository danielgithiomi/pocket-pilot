import { AuthService } from '@api/auth.service';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { LucideAngularModule, Camera } from 'lucide-angular';
import { Component, computed, inject, output, signal } from '@angular/core';

@Component({
    selector: 'profile-picture',
    imports: [LucideAngularModule, NgOptimizedImage, NgClass],
    styles: `
        @reference 'tailwindcss';

        .profile-picture {
            @apply relative size-20 sm:size-25 bg-(--primary) cursor-pointer rounded-full overflow-hidden hover:scale-101 transition-all duration-300;
        }

        .overlay {
            @apply absolute inset-0 rounded-full grid place-items-center z-1;
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
            (click)="profilePictureClicked.emit()"
            (mouseenter)="isHovered.set(true)"
            (mouseleave)="isHovered.set(false)"
            [ngClass]="{ 'border border-primary': !!profilePictureUrl() }" >

            @if (isHovered()) {
                <div class="overlay animate-fade-in">
                    <div class="flex flex-col items-center gap-1">
                        <lucide-angular [size]="20" color="white" [img]="camera" name="change-profile-picture" />
                        <p class="text-xs text-white">
                            {{ profilePictureUrl() ? 'Change' : 'Add' }}
                        </p>
                    </div>
                </div>
            }

            @if (profilePictureUrl()) {
                <img
                    fill
                    alt="Profile Picture"
                    [ngSrc]="profilePictureUrl()"
                    (error)="onProfilePictureError()"
                    class="h-full w-full object-cover" />
            } @else {
                <div class="flex items-center justify-center h-full">
                    <p class="text-white text-5xl">{{ initial() }}</p>
                </div>
            }
        </div>
    `
})
export class ProfilePicture {
    // ICONS
    protected readonly camera = Camera;

    // STATES
    protected readonly isHovered = signal(false);

    // OUTPUTS
    protected readonly profilePictureClicked = output<void>();

    // SERVICES
    protected readonly authService = inject(AuthService);

    // DATA
    protected readonly profilePictureUrl = computed(() => this.authService.user()?.profilePictureUrl ?? '');

    // METHODS
    protected readonly initial = computed(() => {
        const name = this.authService.user()?.name;
        return name ? name.substring(0, 1).toUpperCase() : '';
    });

    protected onProfilePictureError() {
        void this.authService.refreshUser();
    }
}
