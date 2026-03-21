import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { form } from '@angular/forms/signals';
import { Component, input, signal } from '@angular/core';
import {
  ChangePasswordSchema,
  changePasswordValidationSchema,
  initialChangePasswordFormState,
} from './change-password.types';

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

    <div class="card-content">
      <form id="change-password-form" (submit)="onSubmitChangePassword()">
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
          label="Current Password"
          placeholder="••••••••"
          autocomplete="current-password"
          [formField]="changePasswordForm.currentPassword"
        />

        <atom-input
          type="password"
          id="new-password"
          label="New Password"
          placeholder="••••••••"
          autocomplete="new-password"
          [formField]="changePasswordForm.newPassword"
        />

        <atom-input
          id="confirm-new-password"
          type="password"
          label="Confirm New Password"
          placeholder="••••••••"
          autocomplete="new-password"
          [formField]="changePasswordForm.confirmNewPassword"
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

  // STATES
  protected readonly isSubmittingChangePassword = signal<boolean>(false);

  // FORM
  protected changePasswordFormModel = signal<ChangePasswordSchema>(initialChangePasswordFormState);
  protected changePasswordForm = form(this.changePasswordFormModel, changePasswordValidationSchema);

  protected onSubmitChangePassword() {
    console.log('Submit change password');
  }
}
