import { email, maxLength, minLength, required, schema } from '@angular/forms/signals';

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

    // Phone
    required(root.phone, { message: 'The phone is required field!' });
    minLength(root.phone, 8, { message: 'The phone must be at least 8 digits long!' });
    maxLength(root.phone, 10, { message: 'The phone must be at most 10 digits long!' });

    // Message
    required(root.message, { message: 'The message is required field!' });
    minLength(root.message, 10, { message: 'The message must be at least 10 characters long!' });
});
