import { email, maxLength, minLength, required, schema, validate } from '@angular/forms/signals';

// FORM
export interface EditProfileSchema {
  name: string;
  email: string;
  phoneNumber: string;
}

export const initialEditProfileFormState: EditProfileSchema = {
  name: '',
  email: '',
  phoneNumber: '',
};

export const editProfileFormValidationSchema = schema<EditProfileSchema>((root) => {
  // Email
  email(root.email, { message: 'The email address format is invalid!' });
  required(root.email, { message: 'The email address is required field!' });

  // Username
  required(root.name, { message: 'The username is required field!' });
  minLength(root.name, 6, { message: 'The username cannot be less than 6 characters!' });

  // Phone Number
  required(root.phoneNumber, { message: 'The phone number is required field!' });
  minLength(root.phoneNumber, 8, { message: 'The phone number cannot be less than 8 digits!' });
  maxLength(root.phoneNumber, 10, { message: 'The phone number cannot be more than 10 digits!' });
  validate(root.phoneNumber, (context) => {
    const number = context.value();
    if (number && !/^\d+$/.test(number)) {
      return {
        kind: 'phone-number-invalid',
        message: 'The phone number must contain only digits!',
      };
    }
    return null;
  });
  // validate(root.phoneNumber, (context) => {
  //   const number = context.value();
  //   if (!number.startsWith('+'))
  //     return {
  //       kind: 'phone-format',
  //       message: 'The phone number must start with your country code (e.g., +1 for USA)',
  //     };
  //   return undefined;
  // });
});
