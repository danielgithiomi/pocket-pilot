import { Form } from '@organisms/form';
import { NgClass } from '@angular/common';
import { form } from '@angular/forms/signals';
import { AuthService } from '@api/auth.service';
import { DrawerService } from '@infrastructure/services';
import { ProfileDetail } from './profile-detail/profile-detail';
import { ChangePassword } from './change-password/change-password';
import { ProfileSummary } from './profile-summary/profile-summary';
import { Component, computed, inject, signal } from '@angular/core';
import {
  EditProfileSchema,
  initialEditProfileFormState,
  editProfileFormValidationSchema,
} from './profile-summary/profile-summary.types';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [ProfileDetail, NgClass, ChangePassword, ProfileSummary, Form],
})
export class Profile {
  // SERVICES
  protected readonly authService = inject(AuthService);
  protected readonly drawerService: DrawerService = inject(DrawerService);

  // STATES
  protected readonly isEditFormOpen = signal(false);

  // DATA
  protected readonly user = this.authService.user()!;

  // COMPUTED
  protected readonly isFetchingProfileData = computed(() => this.authService.isLoading());

  // FORM
  protected readonly editProfileFormModel = signal<EditProfileSchema>(initialEditProfileFormState);
  protected readonly editProfileForm = form(
    this.editProfileFormModel,
    editProfileFormValidationSchema,
  );
}
