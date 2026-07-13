import { tap } from 'rxjs';
import { Button } from '@atoms/button';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { WEB_ROUTES } from '@global/constants';
import { AuthService } from '@api/auth.service';
import { DrawerService } from '@infrastructure/services';
import { UserSummary } from './user-summary/user-summary';
import { STORED_ONBOARDING_USER_KEY } from '@libs/constants';
import { NotificationsStore } from '@stores/notifications.store';
import { Component, ElementRef, HostListener, inject, input, output, signal, viewChild } from '@angular/core';
import { Bell, LogOut, LucideAngularModule, Menu, Settings2 } from 'lucide-angular';
import { NotificationsDropdown } from '@structural/dropdowns/notifications-dropdown';

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

    // VIEW REFERENCES
    protected readonly notificationsDropdownWrapper =
        viewChild<ElementRef<HTMLElement>>('notificationsDropdownWrapper');

    // SERVICES
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    private readonly drawerService = inject(DrawerService);
    protected readonly notificationsStore = inject(NotificationsStore);

    // DATA
    protected readonly notificationsSummary = this.notificationsStore.notificationsSummary;
    protected readonly isLinkActive = (link: string) => this.router.url === link;

    // METHODS
    protected async goToSettings(): Promise<void> {
        await this.router.navigateByUrl(WEB_ROUTES.settings);
    }

    protected handleNotificationsPanelToggle() {
        this.isNotificationsPanelOpen.update(current => !current);
    }

    @HostListener('document:click', ['$event'])
    protected closeNotificationsPanelOnOutsideClick(event: MouseEvent): void {
        if (!this.isNotificationsPanelOpen()) return;

        const wrapper = this.notificationsDropdownWrapper()?.nativeElement;
        const target = event.target;

        if (!wrapper || !(target instanceof Node)) return;
        if (!wrapper.contains(target)) this.isNotificationsPanelOpen.set(false);
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
