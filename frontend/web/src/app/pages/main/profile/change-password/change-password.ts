import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { form } from '@angular/forms/signals';
import { UserService } from '@api/user.service';
import { ToastService } from '@components/ui/atoms/toast';
import { Component, inject, input, signal } from '@angular/core';
import {
  ChangePasswordSchema,
  changePasswordValidationSchema,
  initialChangePasswordFormState,
} from './change-password.types';
import { AuthService } from '@api/auth.service';
import { IVoidResourceResponse } from '@global/types';

@Component({
  selector: 'change-password',
  imports: [Input, Button],
  styles: `
    @reference 'tailwindcss';

    :host {
      @apply flex flex-col justify-between h-full;
    }
  `,
  template: `
    <div class="card-header">
      <p class="title">Change your password.</p>
      <p class="subtitle">Update your password to remain secure.</p>
    </div>

    <div class="card-content overflow-y-scroll no-scrollbar">
      <form id="change-password-form" (submit)="onSubmitChangePassword($event)">
        <!-- Start Hidden username for accessibility -->
        <input
          type="text"
          class="hidden"
          name="username"
          [value]="userEmail()"
          autocomplete="username"
        />
        <!-- End of hidden username for accessibility -->

        <atom-input
          type="password"
          id="current-password"
          placeholder="••••••••"
          [invertedIcon]="true"
          label="Current Password"
          autocomplete="current-password"
          [formField]="changePasswordForm.currentPassword"
          inputClassName="bg-inverted-background text-inverted-text"
        />

        <atom-input
          type="password"
          id="new-password"
          label="New Password"
          [invertedIcon]="true"
          placeholder="••••••••"
          autocomplete="new-password"
          [formField]="changePasswordForm.newPassword"
          inputClassName="bg-inverted-background text-inverted-text"
        />

        <atom-input
          type="password"
          [invertedIcon]="true"
          placeholder="••••••••"
          id="confirm-new-password"
          autocomplete="new-password"
          label="Confirm New Password"
          [formField]="changePasswordForm.confirmNewPassword"
          inputClassName="bg-inverted-background text-inverted-text"
        />
      </form>
    </div>

    <div class="flex flex-row items-center justify-end w-full">
      <atom-button
        type="submit"
        label="Change Password"
        id="submit-change-password"
        form="change-password-form"
        [isLoading]="isSubmittingChangePassword()"
        [disabled]="changePasswordForm().invalid() || isSubmittingChangePassword()"
      />
    </div>
  `,
})
export class ChangePassword {
  // INPUTS
  userEmail = input.required<string>();

  // SERVICES
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  // STATES
  protected readonly isSubmittingChangePassword = signal<boolean>(false);

  // FORM
  protected changePasswordFormModel = signal<ChangePasswordSchema>(initialChangePasswordFormState);
  protected changePasswordForm = form(this.changePasswordFormModel, changePasswordValidationSchema);

  // METHODS
  private resetChangePasswordForm() {
    this.changePasswordForm().reset();
    this.changePasswordFormModel.set(initialChangePasswordFormState);
  }

  protected onSubmitChangePassword(event: Event) {
    event.preventDefault();

    const { id } = this.authService.user()!;
    const { confirmNewPassword, ...payload } = this.changePasswordFormModel();

    console.log(payload);

    this.isSubmittingChangePassword.set(true);

    setTimeout(() => {
      this.userService.changePassword(id, payload).subscribe({
        next: (reponse: IVoidResourceResponse) => {
          const { message, details } = reponse;
          this.toastService.show({
            details,
            title: message,
            variant: 'success',
          });

          this.resetChangePasswordForm();
        },
        complete: () => this.isSubmittingChangePassword.set(false),
      });
    }, 3000);
  }
}
