import { Button } from '@atoms/button';
import { Router } from '@angular/router';
import { ToastService } from '@atoms/toast';
import { CheckedShield } from '@atoms/icons';
import { AuthService } from '@api/auth.service';
import { form, FormField } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { WEB_ROUTES } from '@global/constants/routes.constants';
import { IAuthResponse, IStandardResponse } from '@global/types';
import { AuthBranding } from '@layouts/auth/auth-branding/branding';
import { initialLoginFormState, loginFormValidationSchema, LoginSchema } from '@libs/types';

@Component({
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
  imports: [FormField, AuthBranding, CheckedShield, Button],
})
export class Login {
  // FORM
  protected loginFormModel = signal<LoginSchema>(initialLoginFormState);
  protected loginForm = form(this.loginFormModel, loginFormValidationSchema);

  // INJECTS
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  // SIGNALS
  readonly isSubmitting = signal<boolean>(false);

  // METHODS
  routeToRegistration = () => this.router.navigate([WEB_ROUTES.register]);

  submitLoginForm = (event: Event) => {
    event.preventDefault();

    const { email, password } = this.loginFormModel();

    this.isSubmitting.set(true);

    setTimeout(() => {
      this.authService.login({ email, password }).subscribe({
        next: (response: IStandardResponse<IAuthResponse>) => {
          this.toastService.show({
            title: response.summary.title,
            details: response.summary.details!,
            variant: 'success',
          });

          this.router.navigateByUrl(WEB_ROUTES.dashboard);
        },
        error: () => this.isSubmitting.set(false),
        complete: () => this.isSubmitting.set(false),
      });
    }, 5000);
  };
}
