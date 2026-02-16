import {Component, inject, signal} from '@angular/core';
import {AuthBranding} from '@layouts/auth/auth-branding/branding';
import {email, form, FormField, min, required} from '@angular/forms/signals';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [AuthBranding, FormField],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  protected registerFormModel = signal<RegisterSchema>(initialFormState);

  protected registerForm = form(
    this.registerFormModel,
    (root) => {
      // Email
      email(root.email, { message: "The email address format is invalid!"});
      required(root.email, { message: "The email address is required field!"});

      // Username
      required(root.username, { message: "The username is required field!"});
      min(root.username, 6, { message: "The username cannot be less than 6 characters!"})

      // Password
      required(root.password, { message: "The password is required field!"});
      min(root.password, 8, { message: "The password cannot be less than 8 characters!"})
    })

  private readonly router = inject(Router);

  routeToLogin = () => this.router.navigate(['/auth/login']);
}

export interface RegisterSchema {
  email: string;
  username: string;
  password: string;
}

export const initialFormState: RegisterSchema = {
  email: '',
  username: '',
  password: '',
};
