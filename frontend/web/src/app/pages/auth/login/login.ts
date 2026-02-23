import { Router } from '@angular/router';
import { CheckedShield } from '@atoms/icons';
import { AuthService } from '@api/auth.service';
import { UserService } from '@api/user.service';
import { form, FormField } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ToastService } from '@components/ui/atoms/toast';
import { AuthBranding } from '@layouts/auth/auth-branding/branding';
import { initialLoginFormState, loginFormValidationSchema, LoginSchema } from '@libs/types';

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
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  routeToRegistration = () => this.router.navigate(['/auth/register']);

  submitLoginForm = (event: Event) => {
    event.preventDefault();

    console.log('Password errors:', this.loginForm.password().errors());
    console.log('Password valid:', this.loginForm.password().valid());
    console.log('Password touched:', this.loginForm.password().touched());

    const { email, password } = this.loginFormModel();

    if (!this.loginForm().valid()) {
      this.toastService.show({
        title: 'Form Invalid',
        message: 'Please fill in all the fields',
        variant: 'error',
      });
      return;
    }

    this.toastService.show({
      title: 'Login',
      message: 'Login successful',
      variant: 'success',
    });

    console.log(email, password);
    this.authService.login({ email, password });
  };
}
