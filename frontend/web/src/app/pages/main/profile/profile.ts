import { User } from '@global/types';
import { Form } from '@organisms/form';
import { NgClass } from '@angular/common';
import { formatFullDate } from '@libs/utils';
import { form } from '@angular/forms/signals';
import { AuthService } from '@api/auth.service';
import { UserService } from '@api/user.service';
import { Input } from '@components/ui/atoms/input';
import { Button } from '@components/ui/atoms/button';
import { DrawerService } from '@infrastructure/services';
import { ToastService } from '@components/ui/atoms/toast';
import { ProfileDetail } from './profile-detail/profile-detail';
import { ChangePassword } from './change-password/change-password';
import { ProfileSummary } from './profile-summary/profile-summary';
import { Component, computed, inject, signal } from '@angular/core';
import {
  EditProfileSchema,
  editProfileFormValidationSchema,
} from './profile-summary/profile-summary.types';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [ProfileDetail, NgClass, ChangePassword, ProfileSummary, Form, Input, Button],
})
export class Profile {
  // SERVICES
  protected readonly authService = inject(AuthService);
  protected readonly userService = inject(UserService);
  protected readonly toastService = inject(ToastService);
  protected readonly drawerService: DrawerService = inject(DrawerService);

  // STATES
  protected readonly isEditFormOpen = signal(false);
  protected readonly isSubmittingEditProfileForm = signal(false);

  // DATA
  protected readonly user = this.authService.user;
  protected readonly initialEditProfileFormData = computed<EditProfileSchema>(() => ({
    name: this.user()!.name,
    email: this.user()!.email,
    phoneNumber: this.user()!.phoneNumber,
  }));

  // COMPUTED
  protected readonly formattedDate = computed<string>(() => {
    return formatFullDate(this.user()!.lastLoginAt.toString());
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
    const initialData = this.initialEditProfileFormData();
    this.editProfileForm().reset(initialData);
    this.editProfileFormModel.set(initialData);
  }

  protected submitEditProfileForm(event: Event) {
    event.preventDefault();

    const { id } = this.user()!;
    const { phoneNumber, ...payload } = this.editProfileFormModel();

    this.isSubmittingEditProfileForm.set(true);

    this.userService.update(id, payload).subscribe({
      next: (user: User) => {
        this.toastService.show({
          variant: 'success',
          title: 'Update Successful!',
          details: 'Your profile has been updated successfully.',
        });

        // Update state & reset form
        this.authService.refreshSession(user);
        this.isEditFormOpen.set(false);
        this.resetEditProfileForm();
      },
      complete: () => this.isSubmittingEditProfileForm.set(false),
    });
  }
}
