import { NgClass } from '@angular/common';
import { AuthService } from '@api/auth.service';
import { DrawerService } from '@infrastructure/services';
import { Component, computed, inject } from '@angular/core';
import { ProfileDetail } from './profile-detail/profile-detail';
import { ChangePassword } from './change-password/change-password';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [ProfileDetail, NgClass, ChangePassword],
})
export class Profile {
  protected readonly authService = inject(AuthService);
  protected readonly drawerService: DrawerService = inject(DrawerService);

  protected readonly user = this.authService.user()!;
  protected readonly isFetchingProfileData = computed(() => this.authService.isLoading());
}
