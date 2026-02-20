import { Router } from '@angular/router';
import { CheckedShield } from '@atoms/icons';
import { form, FormField } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { AuthBranding } from '@layouts/auth/auth-branding/branding';
import { initialLoginFormState, loginFormValidationSchema, LoginSchema } from '@libs/types';
import { LoginService } from 'src/app/api/services/auth';

@Component({
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
  imports: [FormField, AuthBranding, CheckedShield],
})
export class Login {
  protected loginFormModel = signal<LoginSchema>(initialLoginFormState);
  protected loginForm = form(this.loginFormModel, loginFormValidationSchema);
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);

  routeToRegistration = () => this.router.navigate(['/auth/register']);

  submitLoginForm = (event: Event) => {
    event.preventDefault();

    const { email, password } = this.loginFormModel();

    console.log(email, password);
    this.loginService.login();
  };
}
