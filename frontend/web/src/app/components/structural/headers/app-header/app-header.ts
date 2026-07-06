import { tap } from 'rxjs';
import { Button } from '@atoms/button';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { WEB_ROUTES } from '@global/constants';
import { AuthService } from '@api/auth.service';
import { DrawerService } from '@infrastructure/services';
import { UserSummary } from './user-summary/user-summary';
import { STORED_ONBOARDING_USER_KEY } from '@libs/constants';
import { NotificationsDropdown } from './notifications-dropdown';
import { NotificationsService } from '@api/notifications.service';
import { Component, inject, input, output, signal } from '@angular/core';
import { Bell, LogOut, LucideAngularModule, Menu, Settings2 } from 'lucide-angular';

@Component({
    selector: 'app-header',
    styleUrl: './app-header.css',
    templateUrl: './app-header.html',
    imports: [NgClass, LucideAngularModule, UserSummary, Button, NotificationsDropdown]
})
export class AppHeader {
    protected readonly Menu = Menu;
    protected readonly Bell = Bell;
    protected readonly iconSize = 20;
    protected readonly LogOut = LogOut;
    protected readonly Settings = Settings2;

    // INPUTS
    withDrawerLayout = input<boolean>(true);

    // OUTPUTS
    hamburgerClickEmitter = output<void>();

    // SIGNAL STATES
    protected isNotificationsPanelOpen = signal<boolean>(false);

    // SERVICES
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    private readonly drawerService = inject(DrawerService);
    private readonly notificationsService = inject(NotificationsService);

    // DATA
    protected readonly notifications = this.notificationsService.getUserWrappedNotifications();
    protected readonly isLinkActive = (link: string) => this.router.url === link;

    // METHODS
    protected async goToSettings(): Promise<void> {
        await this.router.navigateByUrl(WEB_ROUTES.settings);
    }

    protected handleNotificationsPanelToggle() {
        this.isNotificationsPanelOpen.update(current => !current);
    }

    protected logout() {
        this.authService
            .logout()
            .pipe(tap(async () => await this.router.navigateByUrl(WEB_ROUTES.login)))
            .subscribe({
                complete: () => localStorage.removeItem(STORED_ONBOARDING_USER_KEY)
            });
    }
}

// INTERNAL TYPES
interface hasUnreadNotifications {
    count: number;
    hasUnread: boolean;
}
