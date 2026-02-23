import { Router } from '@angular/router';
import { AuthService } from '@api/auth.service';
import { form, FormField } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { AuthBranding } from '@layouts/auth/auth-branding/branding';
import {
  RegisterSchema,
  initialRegisterFormState,
  registerFormValidationSchema,
} from '@libs/types';

@Component({
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
  imports: [AuthBranding, FormField],
})
export class Register {
  // FORM
  protected registerFormModel = signal<RegisterSchema>(initialRegisterFormState);
  protected registerForm = form(this.registerFormModel, registerFormValidationSchema);

  // INJECTS
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // METHODS
  routeToLogin = () => this.router.navigate(['/auth/login']);

  submitRegistrationForm = (event: Event) => {
    event.preventDefault();

    const { email, username, password } = this.registerFormModel();

    console.log(email, username, password);
  };
}
