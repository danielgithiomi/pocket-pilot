import { Router } from '@angular/router';
import { UserService } from '@api/user.service';
import { form, FormField } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { WEB_ROUTES } from '@global/constants/routes.constants';
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
  private readonly userService = inject(UserService);

  // METHODS
  routeToLogin = () => this.router.navigate([WEB_ROUTES.login]);

  submitRegistrationForm = (event: Event) => {
    event.preventDefault();

    const { email, username, password } = this.registerFormModel();

    console.log(email, username, password);
  };
}
