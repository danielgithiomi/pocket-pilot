import {Auth_Feature} from '@libs/types';
import {WarningIcon} from '@atoms/icons/Warning';
import {NgOptimizedImage} from '@angular/common';
import {APP_FEATURES} from '@constants/auth.constants';
import {Component, signal, WritableSignal} from '@angular/core';
import {AuthFeature} from '@layouts/auth/auth-feature/auth-feature';
import {email, form, FormField, min, required} from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
  imports: [NgOptimizedImage, AuthFeature, WarningIcon, FormField],
})
export class Login {
  protected readonly features: Auth_Feature[] = APP_FEATURES;
  protected year: WritableSignal<number> = signal(new Date().getFullYear());

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
