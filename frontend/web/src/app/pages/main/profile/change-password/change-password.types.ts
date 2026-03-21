import { minLength, required, schema, validate } from '@angular/forms/signals';

export interface ChangePasswordSchema {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const initialChangePasswordFormState: ChangePasswordSchema = {
  newPassword: '',
  currentPassword: '',
  confirmNewPassword: '',
};

export const changePasswordValidationSchema = schema<ChangePasswordSchema>((root) => {
  // Current Password
  required(root.currentPassword, { message: 'The current password is required field!' });
  minLength(root.currentPassword, 8, {
    message: 'Your current password cannot be less than 8 characters!',
  });

  // New Password
  required(root.newPassword, { message: 'The new password is required field!' });
  minLength(root.newPassword, 8, {
    message: 'Your new password cannot be less than 8 characters!',
  });

  validate(root.newPassword, (context) => {
    const newPassword = context.value();
    const currentPassword = context.valueOf(root.currentPassword);

    if (currentPassword === newPassword)
      return {
        kind: 'same-password',
        message: 'The new password cannot be the same as the old password!',
      };

    return null;
  });

  // Confirm New Password
  required(root.confirmNewPassword, { message: 'The confirm new password is required field!' });
  minLength(root.confirmNewPassword, 8, {
    message: 'Your confirm new password cannot be less than 8 characters!',
  });

  validate(root.confirmNewPassword, (context) => {
    const confirmPassword = context.value();
    const newPassword = context.valueOf(root.newPassword);

    if (confirmPassword !== newPassword)
      return {
        kind: 'password-mismatch',
        message: 'The new passwords entered do not match!',
      };

    return undefined;
  });
});
