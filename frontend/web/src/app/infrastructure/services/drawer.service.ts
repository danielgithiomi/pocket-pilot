import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  private readonly dropdownOpen$ = signal(false);
  private readonly drawerCollapsed$ = signal(false);
  private readonly isMobileDrawerOpen$ = signal(false);

  isDropdownOpen = computed(() => this.dropdownOpen$());
  isDrawerCollapsed = computed(() => this.drawerCollapsed$());
  isMobileDrawerOpen = computed(() => this.isMobileDrawerOpen$());

  toggleDropdown() {
    this.dropdownOpen$.set(!this.dropdownOpen$());
  }

  closeDropDown() {
    this.dropdownOpen$.set(false);
  }

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
