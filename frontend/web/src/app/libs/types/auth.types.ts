import { email, minLength, required, schema, validate } from '@angular/forms/signals';

export interface Auth_Feature {
    id: number;
    name: string;
}

// LOGIN
export interface LoginSchema {
    email: string;
    password: string;
}

export const initialLoginFormState: LoginSchema = {
    email: '',
    password: ''
};

export const loginFormValidationSchema = schema<LoginSchema>((root) => {
    // Email
    required(root.email, { message: 'The email address is required field!' });
    email(root.email, { message: 'The email address format is invalid!' });

    // Password
    required(root.password, { message: 'The password is required field!' });
    minLength(root.password, 8, { message: 'The password cannot be less than 8 characters!' });
});

// REGISTRATION
export interface RegisterSchema {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const initialRegisterFormState: RegisterSchema = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
};

export const registerFormValidationSchema = schema<RegisterSchema>((root) => {
    // Email
    email(root.email, { message: 'The email address format is invalid!' });
    required(root.email, { message: 'The email address is required field!' });

    // First Name
    required(root.firstName, { message: 'The first name is a required field!' });
    minLength(root.firstName, 3, { message: 'The first name cannot be less than 3 characters!' });

    // Last Name
    required(root.lastName, { message: 'The last name is a required field!' });
    minLength(root.lastName, 3, { message: 'The last name cannot be less than 3 characters!' });

    // Password
    required(root.password, { message: 'The password is required field!' });
    minLength(root.password, 8, { message: 'The password cannot be less than 8 characters!' });

    // Confirm Password
    required(root.confirmPassword, { message: 'The confirm password is required field!' });
    minLength(root.confirmPassword, 8, {
        message: 'The confirm password cannot be less than 8 characters!'
    });
    validate(root.confirmPassword, (context) => {
        const confirmPassword = context.value();
        const password = context.valueOf(root.password);
        if (confirmPassword === password) return null;
        return {
            kind: 'password-mismatch',
            message: 'The passwords entered do not match!'
        };
    });
});
