import { Router } from '@angular/router';
import { CheckedShield } from '@atoms/icons';
import { AuthService } from '@api/auth.service';
import { form, FormField } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ToastService } from '@components/ui/atoms/toast';
import { WEB_ROUTES } from '@global/constants/routes.constants';
import { IAuthResponse, IStandardResponse } from '@global/types';
import { AuthBranding } from '@layouts/auth/auth-branding/branding';
import { initialLoginFormState, loginFormValidationSchema, LoginSchema } from '@libs/types';

@Component({
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
  imports: [FormField, AuthBranding, CheckedShield],
})
export class Login {
  // FORM
  protected loginFormModel = signal<LoginSchema>(initialLoginFormState);
  protected loginForm = form(this.loginFormModel, loginFormValidationSchema);

  // INJECTS
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  // METHODS
  routeToRegistration = () => this.router.navigate([WEB_ROUTES.register]);

  submitLoginForm = (event: Event) => {
    event.preventDefault();

    const { email, password } = this.loginFormModel();

    this.authService.login({ email, password }).subscribe((response: IStandardResponse<IAuthResponse>) => {
      console.log('Login Component: ', response);
      this.toastService.show({
        title: response.summary.message,
        message: response.summary.description!,
        variant: 'success',
      });

      // Redirect to dashboard
      this.router.navigateByUrl(WEB_ROUTES.dashboard);
    });
  };
}
