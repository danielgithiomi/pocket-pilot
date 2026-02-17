import {Router} from '@angular/router';
import {WarningIcon} from '@atoms/icons/Warning';
import {form, FormField} from '@angular/forms/signals';
import {Component, inject, signal} from '@angular/core';
import {AuthBranding} from '@layouts/auth/auth-branding/branding';
import {initialLoginFormState, loginFormValidationSchema, LoginSchema} from '@libs/types';

@Component({
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
  imports: [WarningIcon, FormField, AuthBranding],
})
export class Login {

  protected loginFormModel = signal<LoginSchema>(initialLoginFormState);

  protected loginForm = form(this.loginFormModel, loginFormValidationSchema);

  private readonly router = inject(Router);

  routeToRegistration = () => this.router.navigate(['/auth/register']);

  submitLoginForm = (event: Event) => {
    event.preventDefault();

    const {email, password} = this.loginFormModel();

    console.log(email, password);
  }
}
