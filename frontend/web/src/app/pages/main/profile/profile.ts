import { NgClass } from '@angular/common';
import { AuthService } from '@api/auth.service';
import { ProfileDetail } from './profile-detail';
import { Component, inject } from '@angular/core';
import { DrawerService } from '@infrastructure/services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [ProfileDetail, NgClass],
})
export class Profile {
  protected readonly authService = inject(AuthService);
  protected readonly drawerService: DrawerService = inject(DrawerService);

  protected readonly user = this.authService.user()!;
}
