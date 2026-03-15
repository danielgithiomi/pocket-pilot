import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  private readonly mobileDrawer$ = signal(false);
  private readonly drawerCollapsed$ = signal(false);
  private readonly isMobileDrawerOpen$ = signal(false);

  isMobileDrawer = computed(() => this.mobileDrawer$());
  isDrawerCollapsed = computed(() => this.drawerCollapsed$());
  isMobileDrawerOpen = computed(() => this.isMobileDrawerOpen$());

  toggleDesktopDrawer() {
    this.drawerCollapsed$.set(!this.drawerCollapsed$());
  }

  openMobileDrawer() {
    this.isMobileDrawerOpen$.set(true);
  }

  closeMobileDrawer() {
    this.isMobileDrawerOpen$.set(false);
  }
}
