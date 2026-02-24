import { Router } from '@angular/router';
import { ToastService } from '@atoms/toast';
import { UserService } from '@api/user.service';
import { form, FormField } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { WEB_ROUTES } from '@global/constants/routes.constants';
import { IAuthResponse, IStandardResponse } from '@global/types';
import { AuthBranding } from '@layouts/auth/auth-branding/branding';
import {
  RegisterSchema,
  initialRegisterFormState,
  registerFormValidationSchema,
} from '@libs/types';
import { Button } from '@components/ui/atoms/button';

@Component({
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
  imports: [AuthBranding, FormField, Button],
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
      next: (response: IStandardResponse<IAuthResponse>) => {
        this.toastService.show({
          variant: 'success',
          title: 'Registration Successful',
          details: 'You are now part of the Pocket Pilot family!',
        });

        this.router.navigateByUrl(WEB_ROUTES.dashboard);
      },
      error: () => this.isSubmitting.set(false),
      complete: () => this.isSubmitting.set(false),
    });
  };
}
