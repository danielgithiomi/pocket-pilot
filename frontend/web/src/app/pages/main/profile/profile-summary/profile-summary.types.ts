import { getNationalNumberDigits } from '@atoms/phone-number';
import { email, minLength, required, schema, validate } from '@angular/forms/signals';

// FORM
export interface EditProfileSchema {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export const editProfileFormValidationSchema = schema<EditProfileSchema>((root) => {
    // Email
    email(root.email, { message: 'The email address format is invalid!' });
    required(root.email, { message: 'The email address is required field!' });

    // First Name
    required(root.firstName, { message: 'The first name is a required field!' });
    minLength(root.firstName, 3, { message: 'The first name cannot be less than 3 characters!' });

    // Last Name
    required(root.lastName, { message: 'The last name is a required field!' });
    minLength(root.lastName, 3, { message: 'The last name cannot be less than 3 characters!' });

    // Phone Number (international format: +{countryCode}{nationalNumber})
    required(root.phoneNumber, { message: 'The phone number is required field!' });
    validate(root.phoneNumber, (control) => {
        const number = control.value();
        if (!number) return null;

        if (!/^\+\d+$/.test(number)) {
            return {
                kind: 'phone-number-invalid',
                message: 'Please enter a valid phone number!'
            };
        }

        const nationalDigits = getNationalNumberDigits(number);
        if (nationalDigits.length < 7) {
            return {
                kind: 'phone-number-too-short',
                message: 'The phone number must be at least 7 digits long!'
            };
        }

        if (nationalDigits.length > 14) {
            return {
                kind: 'phone-number-too-long',
                message: 'The phone number must not exceed 14 digits!'
            };
        }

        return null;
    });
});
