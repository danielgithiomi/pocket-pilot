import { Component, computed } from '@angular/core';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

@Component({
  selector: 'user-summary',
  imports: [LucideAngularModule],
  styles: '',
  template: `
    <div
      id="user-summary"
      class="relative group flex flex-row items-center gap-2 min-w-50 hover:bg-body-background transition-all duration-300 cursor-pointer rounded-lg px-2 py-1"
    >
      <!-- Dropdown Chevron -->
      <div
        id="profile-chevron"
        class="absolute top-1/2 -translate-y-1/2 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <lucide-angular name="profile-chevron" [img]="ChevronDown" [size]="12" />
      </div>

      <div id="avatar" class="size-9 bg-primary grid place-items-center rounded-full">
        <p class="text-white">{{ initial() }}</p>
      </div>

      <div class="flex flex-col space-y-0.5">
        <p class="text-sm font-medium">{{ username }}</p>
        <p class="text-xs text-muted-text uppercase">User</p>
      </div>
    </div>
  `,
})
export class UserSummary {
  protected readonly ChevronDown = ChevronDown;
  protected readonly username = Math.random().toString(36).substring(2, 15);
  protected initial = computed(() => this.username.substring(0, 2).toUpperCase());
}
