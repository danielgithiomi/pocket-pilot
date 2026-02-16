import {email, min, required, schema, validate} from '@angular/forms/signals';

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
  password: '',
};

export const loginFormValidationSchema = schema<LoginSchema>(
  (root) => {
    // Email
    email(root.email, { message: "The email address format is invalid!"});
    required(root.email, { message: "The email address is required field!"});

    // Password
    required(root.password, { message: "The password is required field!"});
    min(root.password, 8, { message: "The password cannot be less than 8 characters!"})
  }
)

// REGISTRATION
export interface RegisterSchema {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export const initialRegisterFormState: RegisterSchema = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
};

export const registerFormValidationSchema = schema<RegisterSchema>(
  (root) => {
    // Email
    email(root.email, { message: "The email address format is invalid!"});
    required(root.email, { message: "The email address is required field!"});

    // Username
    required(root.username, { message: "The username is required field!"});
    min(root.username, 6, { message: "The username cannot be less than 6 characters!"});

    // Password
    required(root.password, { message: "The password is required field!"});
    min(root.password, 8, { message: "The password cannot be less than 8 characters!"});

    // Confirm Password
    required(root.confirmPassword, { message: "The confirm password is required field!"});
    min(root.confirmPassword, 8, { message: "The confirm password cannot be less than 8 characters!"});
    validate(root.confirmPassword, (context) => {
      const confirmPassword = context.value();
      const password = context.valueOf(root.password);
      if (confirmPassword === password) return null;
      return {
        kind: 'password-mismatch',
        message: "The passwords entered do not match"
      }
    })
  }
)
