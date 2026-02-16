import {Component, signal} from '@angular/core';
import {WarningIcon} from '@atoms/icons/Warning';
import {AuthBranding} from '@pages/auth/branding';
import {email, form, FormField, min, required} from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
  imports: [WarningIcon, FormField, AuthBranding],
})
export class Login {
  protected loginFormModel = signal<LoginSchema>(initialFormState);

  protected loginForm = form(
    this.loginFormModel,
    (root) => {
      // Email
      email(root.email, { message: '"The email address format is invalid!"'});
      required(root.email, { message: '"The email address is required field!"'});

      // Password
      required(root.password, { message: '"The password is required field!"'});
      min(root.password, 8, { message: "The password cannot be less than 8 characters!"})
    })
}

export interface LoginSchema {
  email: string;
  password: string;
}

export const initialFormState: LoginSchema = {
  email: '',
  password: '',
};
