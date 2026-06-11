import { getNationalNumberDigits } from '@atoms/phone-number';
import { email, minLength, required, schema, validate } from '@angular/forms/signals';

export interface SupportFormSchema {
    email: string;
    phone: string;
    message: string;
    lastName: string;
    firstName: string;
}

export const SupportFormValidationSchema = schema<SupportFormSchema>((root) => {
    // First Name
    required(root.firstName, { message: 'The first name is required field!' });
    minLength(root.firstName, 3, { message: 'The first name must be at least 3 characters long!' });

    // Last Name
    required(root.lastName, { message: 'The last name is required field!' });
    minLength(root.lastName, 3, { message: 'The last name must be at least 3 characters long!' });

    // Email
    email(root.email, { message: 'The email address format is invalid!' });
    required(root.email, { message: 'The email address is required field!' });

    // Phone (international format: +{countryCode}{nationalNumber})
    required(root.phone, { message: 'The phone is required field!' });
    validate(root.phone, (control) => {
        const number = control.value();
        if (!number) return null;

        if (!/^\+\d+$/.test(number)) {
            return {
                kind: 'phone-number-invalid',
                message: 'Please enter a valid phone number!',
            };
        }

        const nationalDigits = getNationalNumberDigits(number);
        if (nationalDigits.length < 7) {
            return {
                kind: 'phone-number-too-short',
                message: 'The phone number must be at least 7 digits long!',
            };
        }

        if (nationalDigits.length > 14) {
            return {
                kind: 'phone-number-too-long',
                message: 'The phone number must not exceed 14 digits!',
            };
        }

        return null;
    });

    // Message
    required(root.message, { message: 'The message is required field!' });
    minLength(root.message, 10, { message: 'The message must be at least 10 characters long!' });
});
