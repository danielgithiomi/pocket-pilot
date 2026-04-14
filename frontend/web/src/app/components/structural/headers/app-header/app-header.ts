import { tap } from 'rxjs';
import { Button } from '@atoms/button';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { WEB_ROUTES } from '@global/constants';
import { AuthService } from '@api/auth.service';
import { UserSummary } from './user-summary/user-summary';
import { STORED_ONBOARDING_USER_KEY } from '@libs/constants';
import { Component, inject, input, output } from '@angular/core';
import { LucideAngularModule, Menu, Settings2, Bell, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-header',
  styleUrl: './app-header.css',
  templateUrl: './app-header.html',
  imports: [LucideAngularModule, UserSummary, Button, NgClass],
})
export class AppHeader {
  protected readonly Menu = Menu;
  protected readonly Bell = Bell;
  protected readonly iconSize = 20;
  protected readonly LogOut = LogOut;
  protected readonly Settings = Settings2;

  // Inputs
  withDrawerLayout = input<boolean>(true);

  // Outputs
  hamburgerClickEmitter = output<void>();

  // Services
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // Data
  protected readonly isLinkActive = (link: string) => this.router.url === link;

  // Methods
  protected goToSettings() {
    this.router.navigateByUrl(WEB_ROUTES.settings);
  }

  protected logout() {
    this.authService
      .logout()
      .pipe(tap(() => this.router.navigateByUrl(WEB_ROUTES.login)))
      .subscribe({
        complete: () => localStorage.removeItem(STORED_ONBOARDING_USER_KEY),
      });
  }
}
