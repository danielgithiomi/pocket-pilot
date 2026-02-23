import { Router } from '@angular/router';
import { UserService } from '@api/user.service';
import { form, FormField } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ToastService } from '@components/ui/atoms/toast';
import { WEB_ROUTES } from '@global/constants/routes.constants';
import { IAuthResponse, IStandardResponse } from '@global/types';
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
  private readonly toastService = inject(ToastService);

  // METHODS
  routeToLogin = () => this.router.navigate([WEB_ROUTES.login]);

  submitRegistrationForm = (event: Event) => {
    event.preventDefault();

    const { email, name, password } = this.registerFormModel();

    this.userService
      .register({ name, email, password })
      .subscribe((response: IStandardResponse<IAuthResponse>) => {
        this.toastService.show({
          variant: 'success',
          title: 'Registration Successful',
          message: 'You can now log in to your account',
        });

        this.router.navigateByUrl(WEB_ROUTES.login);
      });
  };
}
