import { Form } from '@organisms/form';
import { NgClass } from '@angular/common';
import { form } from '@angular/forms/signals';
import { AuthService } from '@api/auth.service';
import { Input } from '@components/ui/atoms/input';
import { Button } from '@components/ui/atoms/button';
import { DrawerService } from '@infrastructure/services';
import { ProfileDetail } from './profile-detail/profile-detail';
import { ChangePassword } from './change-password/change-password';
import { ProfileSummary } from './profile-summary/profile-summary';
import { Component, computed, inject, signal } from '@angular/core';
import {
  EditProfileSchema,
  editProfileFormValidationSchema,
} from './profile-summary/profile-summary.types';
import { formatDate, formatFullDate } from '@libs/utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [ProfileDetail, NgClass, ChangePassword, ProfileSummary, Form, Input, Button],
})
export class Profile {
  // SERVICES
  protected readonly authService = inject(AuthService);
  protected readonly drawerService: DrawerService = inject(DrawerService);

  // STATES
  protected readonly isEditFormOpen = signal(false);
  protected readonly isSubmittingEditProfileForm = signal(false);

  // DATA
  protected readonly user = this.authService.user()!;
  protected readonly initialEditProfileFormData = computed<EditProfileSchema>(() => ({
    name: this.user.name,
    email: this.user.email,
    phoneNumber: '+123 4567890',
  }));

  // COMPUTED
  protected readonly formattedDate = computed<string>(() => {
    return formatFullDate(this.user.lastLoginAt.toString());
  });
  protected readonly isFetchingProfileData = computed(() => this.authService.isLoading());

  // FORM
  protected readonly editProfileFormModel = signal<EditProfileSchema>(
    this.initialEditProfileFormData(),
  );
  protected readonly editProfileForm = form(
    this.editProfileFormModel,
    editProfileFormValidationSchema,
  );

  // METHODS
  protected resetEditProfileForm() {
    this.editProfileForm().reset();
    this.editProfileFormModel.set(this.initialEditProfileFormData());
  }

  protected submitEditProfileForm(event: Event) {
    event.preventDefault();

    const { name, email, phoneNumber } = this.editProfileFormModel();
    console.log(name, email, phoneNumber);
  }
}
