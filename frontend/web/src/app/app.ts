import { ToastContainer } from '@atoms/toast';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@api/auth.service';
import { Component, computed, inject, effect } from '@angular/core';
import { ThemeService, type Theme } from '@infrastructure/services/theme.service';

@Component({
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  imports: [RouterOutlet, ToastContainer],
})
export class App {
  protected readonly authService: AuthService = inject(AuthService);
  protected readonly themeService: ThemeService = inject(ThemeService);
  protected isLoading = computed<boolean>(() => this.authService.isLoading());

  constructor() {
    // When auth state resolves, sync with backend theme preference
    effect(() => {
      const user = this.authService.user();
      const theme = user?.userPreferences.preferredTheme;
      if (user && theme) {
        this.themeService.initializeTheme(theme as Theme);
      }
    });
  }
}
