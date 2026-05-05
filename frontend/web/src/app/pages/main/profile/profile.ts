import { User } from '@global/types';
import { Form } from '@organisms/form';
import { NgClass } from '@angular/common';
import { formatFullDate } from '@libs/utils';
import { form } from '@angular/forms/signals';
import { AwsService } from '@api/aws.service';
import { AuthService } from '@api/auth.service';
import { UserService } from '@api/user.service';
import { Input } from '@components/ui/atoms/input';
import { Button } from '@components/ui/atoms/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
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
  imports: [
    Form,
    Input,
    Button,
    NgClass,
    ProfileDetail,
    ProfileSummary,
    ChangePassword,
    ReactiveFormsModule,
  ],
})
export class Profile {
  // SERVICES
  protected readonly authService = inject(AuthService);
  protected readonly userService = inject(UserService);
  protected readonly toastService = inject(ToastService);
  protected readonly drawerService: DrawerService = inject(DrawerService);

  // STATES
  protected readonly isDragOver = signal(false);
  protected readonly isEditFormOpen = signal(false);
  protected readonly selectedImage = signal<File | null>(null);
  protected readonly isSubmittingEditProfileForm = signal(false);
  protected readonly isSubmittingProfilePictureForm = signal(false);
  protected readonly isProfilePictureFormOpen = signal<boolean>(false);

  // SERVICES
  private readonly awsService = inject(AwsService);

  // DATA
  protected readonly user = this.authService.user;
  protected readonly uploadProgress = this.awsService.progress;
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

  // PROFILE PICTURE FORM
  protected readonly formGroup = new FormGroup({
    profilePicture: new FormControl<File | null>(null),
  });

  // METHODS
  protected resetEditProfileForm() {
    const initialData = this.initialEditProfileFormData();
    this.editProfileForm().reset(initialData);
    this.editProfileFormModel.set(initialData);
  }

  protected resetProfilePictureForm() {
    this.formGroup.reset();
    this.selectedImage.set(null);
  }

  protected isUpdatedDataChanged(): boolean {
    const initialData = this.initialEditProfileFormData();
    const currentData = this.editProfileFormModel();
    return (
      initialData.name !== currentData.name ||
      initialData.email !== currentData.email ||
      initialData.phoneNumber !== currentData.phoneNumber
    );
  }

  protected handleOnFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.toastService.show({
        variant: 'error',
        title: 'File Upload Error',
        details: 'Please select an image to upload.',
      });
      return;
    }
    this.selectedImage.set(file);
  }

  // DRAG AND DROP HANDLERS
  protected onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  protected onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        this.toastService.show({
          variant: 'error',
          title: 'Invalid File Type',
          details: 'Please drop an image file.',
        });
        return;
      }
      this.selectedImage.set(file);
      this.formGroup.patchValue({ profilePicture: file });
    }
  }

  protected formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // SUBMISSIONS
  protected submitEditProfileForm(event: Event) {
    event.preventDefault();

    const { id } = this.user()!;
    const payload = this.editProfileFormModel();

    this.isSubmittingEditProfileForm.set(true);

    this.userService.update(id, payload).subscribe({
      next: (user: User) => {
        this.toastService.show({
          variant: 'success',
          title: 'Update Successful!',
          details: 'Your profile has been updated successfully.',
        });

        this.authService.refreshSession(user);
        this.isEditFormOpen.set(false);
        this.resetEditProfileForm();
      },
      complete: () => this.isSubmittingEditProfileForm.set(false),
    });
  }

  protected submitEditProfilePictureForm(event: Event) {
    event.preventDefault();
    const file = this.selectedImage();

    if (!file) {
      this.toastService.show({
        variant: 'error',
        title: 'File Upload Error',
        details: 'Please select an image to upload.',
      });
      return;
    }

    this.isSubmittingProfilePictureForm.set(true);

    setTimeout(() => {
      this.awsService.updateProfilePicture(file).subscribe({
        next: (progress: number) => {
          if (progress === 100) {
            this.toastService.show({
              variant: 'success',
              title: 'Profile Picture Updated!',
              details: 'Your profile picture has been updated successfully.',
            });

            this.resetProfilePictureForm();
            this.isProfilePictureFormOpen.set(false);
            window.location.reload();
          }
        },
        complete: () => this.isSubmittingProfilePictureForm.set(false),
      });
    }, 2000);
  }
}
