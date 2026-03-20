import { NgClass } from '@angular/common';
import { form } from '@angular/forms/signals';
import { AuthService } from '@api/auth.service';
import { ProfileDetail } from './profile-detail';
import { Input } from '@components/ui/atoms/input';
import { Button } from '@components/ui/atoms/button';
import { DrawerService } from '@infrastructure/services';
import { Component, computed, inject, signal } from '@angular/core';
import {
  ChangePasswordSchema,
  changePasswordValidationSchema,
  initialChangePasswordFormState,
} from './profile.types';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [ProfileDetail, NgClass, Input, Button],
})
export class Profile {
  protected readonly authService = inject(AuthService);
  protected readonly drawerService: DrawerService = inject(DrawerService);

  // STATES
  protected readonly isSubmittingChangePassword = signal<boolean>(false);

  protected readonly user = this.authService.user()!;
  protected readonly isFetchingProfileData = computed(() => this.authService.isLoading());

  // FORM
  protected changePasswordFormModel = signal<ChangePasswordSchema>(initialChangePasswordFormState);
  protected changePasswordForm = form(this.changePasswordFormModel, changePasswordValidationSchema);
  
  protected onSubmitChangePassword() {
    console.log('Submit change password');
  }
}
