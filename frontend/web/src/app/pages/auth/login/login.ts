import { Button } from '@atoms/button';
import { Router } from '@angular/router';
import { ToastService } from '@atoms/toast';
import { CheckedShield } from '@atoms/icons';
import { AuthService } from '@api/auth.service';
import { Input } from "@components/ui/atoms/input";
import { form, FormField } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { WEB_ROUTES } from '@global/constants/routes.constants';
import { IAuthResponse, IStandardResponse } from '@global/types';
import { Eye, EyeOff, LucideAngularModule } from 'lucide-angular';
import { AuthBranding } from '@structural/auth/auth-branding/branding';
import { initialLoginFormState, loginFormValidationSchema, LoginSchema } from '@libs/types';

@Component({
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
  imports: [FormField, AuthBranding, CheckedShield, Button, LucideAngularModule, Input],
})
export class Login {
  // ICONS
  protected readonly Eye = Eye;
  protected readonly iconSize = 18;
  protected readonly EyeOff = EyeOff;
  
  // FORM
  protected loginFormModel = signal<LoginSchema>(initialLoginFormState);
  protected loginForm = form(this.loginFormModel, loginFormValidationSchema);

  // INJECTS
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  // SIGNALS
  readonly isSubmitting = signal<boolean>(false);
  protected isPasswordVisible = signal<boolean>(false);

  // METHODS
  togglePasswordVisibility = () => {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  };

  routeTo = (route: string) => this.router.navigate([route]);

  submitLoginForm = (event: Event) => {
    event.preventDefault();

    const { email, password } = this.loginFormModel();

    this.isSubmitting.set(true);

    setTimeout(() => {
      this.authService.login({ email, password }).subscribe({
        next: (response: IStandardResponse<IAuthResponse>) => {
          this.toastService.show({
            variant: 'success',
            title: response.summary.title,
            details: `Welcome back to Pocket Pilot - ${response.data.name.toLocaleUpperCase()}`,
          });

          this.routeTo(WEB_ROUTES.dashboard);
        },
        error: () => this.isSubmitting.set(false),
        complete: () => this.isSubmitting.set(false),
      });
    }, 3000);
  };
}
