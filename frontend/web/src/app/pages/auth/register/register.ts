import { Input } from '@atoms/input';
import { User } from '@global/types';
import { Button } from '@atoms/button';
import { Router } from '@angular/router';
import { ToastService } from '@atoms/toast';
import { UserService } from '@api/user.service';
import { form, FormField } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { WEB_ROUTES } from '@global/constants/routes.constants';
import { AuthBranding } from '@structural/auth/auth-branding/branding';
import {
  RegisterSchema,
  initialRegisterFormState,
  registerFormValidationSchema,
} from '@libs/types';

@Component({
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
  imports: [AuthBranding, FormField, Button, Input],
})
export class Register {
  // SIGNALS
  protected isSubmitting = signal<boolean>(false);

  // FORM
  protected registerFormModel = signal<RegisterSchema>(initialRegisterFormState);
  protected registerForm = form(this.registerFormModel, registerFormValidationSchema);

  // INJECTS
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  // METHODS
  routeToLogin = () => this.router.navigate([WEB_ROUTES.login]);

  submitRegistrationForm = (event: Event) => {
    event.preventDefault();

    this.isSubmitting.set(true);

    const { email, name, password } = this.registerFormModel();

    this.userService.register({ name, email, password }).subscribe({
      next: (response: User) => {
        const { name } = response;
        this.toastService.show({
          variant: 'success',
          title: 'Registration Successful!',
          details: `Welcome ${name}! You are now part of the Pocket Pilot family!`,
        });

        this.router.navigateByUrl(WEB_ROUTES.onboarding);
      },
      complete: () => this.isSubmitting.set(false),
    });
  };
}
