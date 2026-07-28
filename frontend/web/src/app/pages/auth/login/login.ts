import { firstValueFrom } from 'rxjs';
import { Button } from '@atoms/button';
import { Router } from '@angular/router';
import { AuthError } from '@libs/constants';
import { ToastService } from '@atoms/toast';
import { CheckedShield } from '@atoms/icons';
import { LoginPayload } from '@global/types';
import { AuthService } from '@api/auth.service';
import { extractValueFromInputField } from '@libs/utils';
import { Input } from '@components/ui/atoms/input';
import { Component, inject, signal } from '@angular/core';
import { WEB_ROUTES } from '@global/constants/routes.constants';
import { Eye, EyeOff, LucideAngularModule } from 'lucide-angular';
import { AuthBranding } from '@structural/auth/auth-branding/branding';
import { FieldTree, form, FormField, FormRoot } from '@angular/forms/signals';
import { initialLoginFormState, loginFormValidationSchema, LoginSchema } from '@libs/types';

@Component({
    selector: 'app-login',
    styleUrl: './login.css',
    templateUrl: './login.html',
    imports: [FormRoot, FormField, AuthBranding, CheckedShield, Button, LucideAngularModule, Input]
})
export class Login {
    // ICONS
    protected readonly Eye = Eye;
    protected readonly iconSize = 18;
    protected readonly EyeOff = EyeOff;

    // FORM
    protected loginFormModel = signal<LoginSchema>(initialLoginFormState);
    protected loginForm = form(this.loginFormModel, loginFormValidationSchema, {
        submission: {
            ignoreValidators: 'none',
            action: (field: FieldTree<LoginSchema>) => this.handleLoginFormSubmission(field)
        }
    });

    // INJECTS
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    private readonly toastService = inject(ToastService);

    // SIGNALS
    protected isPasswordVisible = signal<boolean>(false);

    // METHODS
    togglePasswordVisibility = () => {
        this.isPasswordVisible.set(!this.isPasswordVisible());
    };

    routeTo = (route: string) => this.router.navigate([route], { replaceUrl: true });

    // FORM SUBMISSIONS
    private async handleLoginFormSubmission(field: FieldTree<LoginSchema>) {
        const payload: LoginPayload = extractValueFromInputField(field);

        const response = await firstValueFrom(this.authService.login(payload));

        if (!response) return;

        if ('data' in response) {
            this.routeTo(WEB_ROUTES.dashboard).then(() => {
                this.toastService.show({
                    variant: 'success',
                    title: response.summary.title,
                    details: `Welcome back to Pocket Pilot - ${response.data.name.toLocaleUpperCase()}`
                });
            });
            return;
        } else {
            const { type, message } = response as { type: AuthError; message: string };

            switch (type) {
                case 'email':
                    return {
                        message,
                        kind: 'email',
                        fieldTree: field.email
                    };
                case 'password':
                    return {
                        message,
                        kind: 'password',
                        fieldTree: field.password
                    };
                default:
                    return;
            }
        }
    }
}
